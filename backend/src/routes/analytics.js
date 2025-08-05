const express = require('express');
const prisma = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Dashboard overview
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Métricas principais
    const [
      totalContacts,
      activeCampaigns,
      messagesSent,
      monthlyGrowth
    ] = await Promise.all([
      prisma.contact.count({ where: { userId } }),
      prisma.campaign.count({ 
        where: { 
          userId, 
          status: { in: ['sending', 'scheduled'] } 
        } 
      }),
      prisma.campaignSend.count({
        where: {
          campaign: { userId },
          status: 'sent'
        }
      }),
      prisma.contact.count({
        where: {
          userId,
          createdAt: { gte: thirtyDaysAgo }
        }
      })
    ]);

    // Crescimento semanal
    const weeklyContacts = await prisma.contact.count({
      where: {
        userId,
        createdAt: { gte: sevenDaysAgo }
      }
    });

    // Contatos por fonte
    const contactsBySource = await prisma.contact.groupBy({
      by: ['source'],
      where: { userId },
      _count: {
        id: true
      }
    });

    // Campanhas recentes
    const recentCampaigns = await prisma.campaign.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        _count: {
          select: { sends: true }
        }
      }
    });

    // Contatos recentes
    const recentContacts = await prisma.contact.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        phone: true,
        source: true,
        createdAt: true
      }
    });

    res.json({
      metrics: {
        totalContacts,
        activeCampaigns,
        messagesSent,
        monthlyGrowth: {
          value: monthlyGrowth,
          percentage: totalContacts > 0 ? Math.round((monthlyGrowth / totalContacts) * 100) : 0
        },
        weeklyGrowth: {
          value: weeklyContacts,
          percentage: totalContacts > 0 ? Math.round((weeklyContacts / totalContacts) * 100) : 0
        }
      },
      contactsBySource: contactsBySource.map(item => ({
        source: item.source,
        count: item._count.id
      })),
      recentCampaigns: recentCampaigns.map(campaign => ({
        ...campaign,
        totalSends: campaign._count.sends
      })),
      recentContacts
    });
  } catch (error) {
    console.error('Erro ao buscar analytics do dashboard:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Analytics de contatos
router.get('/contacts', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = '30' } = req.query; // dias
    
    const daysAgo = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);

    // Contatos por dia
    const contactsPerDay = await prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM contacts 
      WHERE user_id = ${userId} 
        AND created_at >= ${daysAgo}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    // Contatos por fonte
    const contactsBySource = await prisma.contact.groupBy({
      by: ['source'],
      where: { 
        userId,
        createdAt: { gte: daysAgo }
      },
      _count: {
        id: true
      }
    });

    // Contatos com email vs sem email
    const [withEmail, withoutEmail] = await Promise.all([
      prisma.contact.count({
        where: {
          userId,
          email: { not: null },
          createdAt: { gte: daysAgo }
        }
      }),
      prisma.contact.count({
        where: {
          userId,
          email: null,
          createdAt: { gte: daysAgo }
        }
      })
    ]);

    // Top tags
    const contactsWithTags = await prisma.contact.findMany({
      where: {
        userId,
        tags: { not: null },
        createdAt: { gte: daysAgo }
      },
      select: { tags: true }
    });

    const tagCounts = {};
    contactsWithTags.forEach(contact => {
      if (contact.tags) {
        const tags = JSON.parse(contact.tags);
        tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    const topTags = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    res.json({
      period: parseInt(period),
      contactsPerDay: contactsPerDay.map(row => ({
        date: row.date,
        count: Number(row.count)
      })),
      contactsBySource: contactsBySource.map(item => ({
        source: item.source,
        count: item._count.id
      })),
      emailStats: {
        withEmail,
        withoutEmail,
        percentage: withEmail + withoutEmail > 0 ? 
          Math.round((withEmail / (withEmail + withoutEmail)) * 100) : 0
      },
      topTags
    });
  } catch (error) {
    console.error('Erro ao buscar analytics de contatos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Analytics de campanhas
router.get('/campaigns', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = '30' } = req.query;
    
    const daysAgo = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);

    // Campanhas por status
    const campaignsByStatus = await prisma.campaign.groupBy({
      by: ['status'],
      where: {
        userId,
        createdAt: { gte: daysAgo }
      },
      _count: {
        id: true
      }
    });

    // Performance das campanhas
    const campaignPerformance = await prisma.campaign.findMany({
      where: {
        userId,
        status: 'sent',
        createdAt: { gte: daysAgo }
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        totalRecipients: true,
        successfulSends: true,
        failedSends: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Envios por dia
    const sendsPerDay = await prisma.$queryRaw`
      SELECT 
        DATE(sent_at) as date,
        COUNT(*) as count,
        SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as successful,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
      FROM campaign_sends cs
      JOIN campaigns c ON cs.campaign_id = c.id
      WHERE c.user_id = ${userId} 
        AND cs.sent_at >= ${daysAgo}
      GROUP BY DATE(sent_at)
      ORDER BY date ASC
    `;

    // Custo total
    const totalCost = await prisma.campaignSend.aggregate({
      where: {
        campaign: { userId },
        sentAt: { gte: daysAgo }
      },
      _sum: {
        cost: true
      }
    });

    // Taxa de sucesso geral
    const [totalSends, successfulSends] = await Promise.all([
      prisma.campaignSend.count({
        where: {
          campaign: { userId },
          sentAt: { gte: daysAgo }
        }
      }),
      prisma.campaignSend.count({
        where: {
          campaign: { userId },
          status: 'sent',
          sentAt: { gte: daysAgo }
        }
      })
    ]);

    const successRate = totalSends > 0 ? (successfulSends / totalSends) * 100 : 0;

    res.json({
      period: parseInt(period),
      campaignsByStatus: campaignsByStatus.map(item => ({
        status: item.status,
        count: item._count.id
      })),
      campaignPerformance: campaignPerformance.map(campaign => ({
        ...campaign,
        successRate: campaign.totalRecipients > 0 ? 
          Math.round((campaign.successfulSends / campaign.totalRecipients) * 100) : 0
      })),
      sendsPerDay: sendsPerDay.map(row => ({
        date: row.date,
        total: Number(row.count),
        successful: Number(row.successful),
        failed: Number(row.failed)
      })),
      summary: {
        totalCost: totalCost._sum.cost || 0,
        totalSends,
        successfulSends,
        failedSends: totalSends - successfulSends,
        successRate: Math.round(successRate)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar analytics de campanhas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ROI e métricas avançadas
router.get('/roi', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = '30' } = req.query;
    
    const daysAgo = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);

    // Custo total de campanhas
    const totalCost = await prisma.campaignSend.aggregate({
      where: {
        campaign: { userId },
        sentAt: { gte: daysAgo }
      },
      _sum: {
        cost: true
      }
    });

    // Métricas de engajamento
    const [
      totalContacts,
      activeContacts, // Contatos que receberam mensagens
      newContacts
    ] = await Promise.all([
      prisma.contact.count({ where: { userId } }),
      prisma.contact.count({
        where: {
          userId,
          campaignSends: {
            some: {
              sentAt: { gte: daysAgo }
            }
          }
        }
      }),
      prisma.contact.count({
        where: {
          userId,
          createdAt: { gte: daysAgo }
        }
      })
    ]);

    // Customer Lifetime Value estimado (mockado)
    const estimatedCLV = 150; // CHF por cliente
    const estimatedRevenue = newContacts * estimatedCLV;
    const roi = totalCost._sum.cost > 0 ? 
      ((estimatedRevenue - totalCost._sum.cost) / totalCost._sum.cost) * 100 : 0;

    // Retenção (contatos que foram contactados mais de uma vez)
    const retentionRate = await prisma.$queryRaw`
      SELECT 
        COUNT(DISTINCT contact_id) as retained_contacts
      FROM campaign_sends cs
      JOIN campaigns c ON cs.campaign_id = c.id
      WHERE c.user_id = ${userId}
        AND cs.sent_at >= ${daysAgo}
      GROUP BY contact_id
      HAVING COUNT(*) > 1
    `;

    res.json({
      period: parseInt(period),
      financial: {
        totalCost: totalCost._sum.cost || 0,
        estimatedRevenue,
        roi: Math.round(roi),
        costPerContact: totalCost._sum.cost > 0 && activeContacts > 0 ? 
          (totalCost._sum.cost / activeContacts).toFixed(2) : 0
      },
      engagement: {
        totalContacts,
        activeContacts,
        newContacts,
        retainedContacts: retentionRate.length,
        engagementRate: totalContacts > 0 ? 
          Math.round((activeContacts / totalContacts) * 100) : 0,
        retentionRate: activeContacts > 0 ? 
          Math.round((retentionRate.length / activeContacts) * 100) : 0
      },
      growth: {
        contactGrowth: Math.round((newContacts / Math.max(totalContacts - newContacts, 1)) * 100),
        projectedMonthlyGrowth: Math.round(newContacts * (30 / parseInt(period)))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar ROI:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;