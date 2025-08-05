const express = require('express');
const { body } = require('express-validator');
const prisma = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const { sendSMS } = require('../services/smsService');

const router = express.Router();

// Validações
const createCampaignValidation = [
  body('name').notEmpty().withMessage('Nome da campanha é obrigatório'),
  body('message').notEmpty().withMessage('Mensagem é obrigatória'),
  body('campaignType').optional().isIn(['sms', 'email']).withMessage('Tipo de campanha inválido'),
  body('scheduledAt').optional().isISO8601().withMessage('Data de agendamento inválida'),
  body('filters').optional().isObject().withMessage('Filtros devem ser um objeto')
];

// Listar campanhas
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = '',
      campaignType = ''
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      userId: req.user.id,
      ...(status && { status }),
      ...(campaignType && { campaignType })
    };

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        include: {
          template: true,
          _count: {
            select: { sends: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: parseInt(limit)
      }),
      prisma.campaign.count({ where })
    ]);

    const processedCampaigns = campaigns.map(campaign => ({
      ...campaign,
      variables: campaign.variables ? JSON.parse(campaign.variables) : {},
      filters: campaign.filters ? JSON.parse(campaign.filters) : {},
      targetAudience: campaign.targetAudience ? JSON.parse(campaign.targetAudience) : null,
      totalSends: campaign._count.sends
    }));

    res.json({
      campaigns: processedCampaigns,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar campanhas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar campanha por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: {
        template: true,
        sends: {
          include: {
            contact: true
          }
        }
      }
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campanha não encontrada' });
    }

    const processedCampaign = {
      ...campaign,
      variables: campaign.variables ? JSON.parse(campaign.variables) : {},
      filters: campaign.filters ? JSON.parse(campaign.filters) : {},
      targetAudience: campaign.targetAudience ? JSON.parse(campaign.targetAudience) : null
    };

    res.json(processedCampaign);
  } catch (error) {
    console.error('Erro ao buscar campanha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar campanha
router.post('/', authenticateToken, createCampaignValidation, handleValidationErrors, async (req, res) => {
  try {
    const {
      name,
      message,
      campaignType = 'sms',
      templateId,
      variables,
      filters,
      scheduledAt
    } = req.body;

    const campaign = await prisma.campaign.create({
      data: {
        userId: req.user.id,
        name,
        message,
        campaignType,
        templateId,
        variables: variables ? JSON.stringify(variables) : null,
        filters: filters ? JSON.stringify(filters) : null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: scheduledAt ? 'scheduled' : 'draft'
      },
      include: {
        template: true
      }
    });

    res.status(201).json({
      message: 'Campanha criada com sucesso',
      campaign: {
        ...campaign,
        variables: campaign.variables ? JSON.parse(campaign.variables) : {},
        filters: campaign.filters ? JSON.parse(campaign.filters) : {}
      }
    });
  } catch (error) {
    console.error('Erro ao criar campanha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Enviar campanha
router.post('/:id/send', authenticateToken, async (req, res) => {
  try {
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campanha não encontrada' });
    }

    if (campaign.status === 'sent') {
      return res.status(400).json({ error: 'Campanha já foi enviada' });
    }

    // Buscar contatos (aplicar filtros se existirem)
    const contacts = await prisma.contact.findMany({
      where: {
        userId: req.user.id
        // TODO: Aplicar filtros baseados em campaign.filters
      }
    });

    if (contacts.length === 0) {
      return res.status(400).json({ error: 'Nenhum contato encontrado para envio' });
    }

    // Atualizar status da campanha
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: {
        status: 'sending',
        totalRecipients: contacts.length,
        sentAt: new Date()
      }
    });

    // Processar envios de forma assíncrona
    processAsyncSends(campaign, contacts);

    res.json({
      message: 'Campanha iniciada com sucesso',
      totalRecipients: contacts.length
    });
  } catch (error) {
    console.error('Erro ao enviar campanha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Função para processar envios assíncronos
async function processAsyncSends(campaign, contacts) {
  let successfulSends = 0;
  let failedSends = 0;

  for (const contact of contacts) {
    try {
      // Criar registro de envio
      const campaignSend = await prisma.campaignSend.create({
        data: {
          campaignId: campaign.id,
          contactId: contact.id,
          status: 'pending'
        }
      });

      // Processar variáveis na mensagem
      let processedMessage = campaign.message;
      if (campaign.variables) {
        const variables = JSON.parse(campaign.variables);
        Object.keys(variables).forEach(key => {
          const placeholder = `{{${key}}}`;
          processedMessage = processedMessage.replace(new RegExp(placeholder, 'g'), variables[key]);
        });
      }

      // Substituir variáveis do contato
      processedMessage = processedMessage.replace(/{{nome}}/g, contact.name);

      if (campaign.campaignType === 'sms') {
        // Enviar SMS
        const smsResult = await sendSMS(contact.phone, processedMessage);
        
        await prisma.campaignSend.update({
          where: { id: campaignSend.id },
          data: {
            status: smsResult.success ? 'sent' : 'failed',
            sentAt: smsResult.success ? new Date() : null,
            errorMessage: smsResult.error || null,
            responseData: JSON.stringify(smsResult.data),
            cost: smsResult.cost || 0
          }
        });

        if (smsResult.success) {
          successfulSends++;
        } else {
          failedSends++;
        }
      }

      // Pequeno delay para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Erro ao enviar para contato ${contact.id}:`, error);
      failedSends++;
      
      await prisma.campaignSend.update({
        where: { id: campaignSend.id },
        data: {
          status: 'failed',
          errorMessage: error.message
        }
      });
    }
  }

  // Atualizar campanha com resultados finais
  await prisma.campaign.update({
    where: { id: campaign.id },
    data: {
      status: 'sent',
      successfulSends,
      failedSends
    }
  });

  console.log(`Campanha ${campaign.id} finalizada: ${successfulSends} sucessos, ${failedSends} falhas`);
}

// Estatísticas de campanhas
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [
      totalCampaigns,
      activeCampaigns,
      totalMessagesSent,
      successRate
    ] = await Promise.all([
      prisma.campaign.count({ where: { userId } }),
      prisma.campaign.count({ where: { userId, status: { in: ['sending', 'scheduled'] } } }),
      prisma.campaignSend.count({
        where: {
          campaign: { userId },
          status: 'sent'
        }
      }),
      prisma.campaignSend.aggregate({
        where: { campaign: { userId } },
        _avg: {
          cost: true
        },
        _count: {
          status: true
        }
      })
    ]);

    // Calcular taxa de sucesso
    const totalSends = await prisma.campaignSend.count({
      where: { campaign: { userId } }
    });
    const successfulSends = await prisma.campaignSend.count({
      where: {
        campaign: { userId },
        status: 'sent'
      }
    });

    const calculatedSuccessRate = totalSends > 0 ? (successfulSends / totalSends) * 100 : 0;

    res.json({
      totalCampaigns,
      activeCampaigns,
      messagesSent: totalMessagesSent,
      successRate: Math.round(calculatedSuccessRate)
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar campanha
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deletedCampaign = await prisma.campaign.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user.id,
        status: { in: ['draft', 'scheduled'] } // Só permite deletar drafts e agendadas
      }
    });

    if (deletedCampaign.count === 0) {
      return res.status(404).json({ error: 'Campanha não encontrada ou não pode ser deletada' });
    }

    res.json({ message: 'Campanha deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar campanha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;