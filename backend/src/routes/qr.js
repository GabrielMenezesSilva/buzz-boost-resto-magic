const express = require('express');
const QRCode = require('qrcode');
const prisma = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Gerar QR Code para o usuário logado
router.get('/generate', authenticateToken, async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }

    // URL para o formulário público de contato
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const formUrl = `${baseUrl}/public/${profile.qrCode}`;

    // Gerar QR Code como Data URL (base64)
    const qrCodeDataUrl = await QRCode.toDataURL(formUrl, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 512
    });

    res.json({
      qrCode: profile.qrCode,
      formUrl,
      qrCodeImage: qrCodeDataUrl,
      instructions: {
        print: 'Imprima este QR code e coloque em mesas, balcão ou entrada',
        usage: 'Clientes escaneiam com a câmera do celular para se cadastrar',
        benefits: 'Capture contatos automaticamente e faça marketing direto'
      }
    });
  } catch (error) {
    console.error('Erro ao gerar QR code:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Gerar QR Code customizado
router.post('/generate-custom', authenticateToken, async (req, res) => {
  try {
    const {
      size = 512,
      darkColor = '#000000',
      lightColor = '#FFFFFF',
      errorCorrectionLevel = 'M',
      margin = 2
    } = req.body;

    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const formUrl = `${baseUrl}/public/${profile.qrCode}`;

    // Validações
    if (size < 128 || size > 2048) {
      return res.status(400).json({ error: 'Tamanho deve estar entre 128 e 2048 pixels' });
    }

    const qrCodeDataUrl = await QRCode.toDataURL(formUrl, {
      errorCorrectionLevel,
      type: 'image/png',
      quality: 0.92,
      margin,
      color: {
        dark: darkColor,
        light: lightColor
      },
      width: size
    });

    res.json({
      qrCode: profile.qrCode,
      formUrl,
      qrCodeImage: qrCodeDataUrl,
      settings: {
        size,
        darkColor,
        lightColor,
        errorCorrectionLevel,
        margin
      }
    });
  } catch (error) {
    console.error('Erro ao gerar QR code customizado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Regenerar QR code (criar novo código)
router.post('/regenerate', authenticateToken, async (req, res) => {
  try {
    const { v4: uuidv4 } = require('uuid');
    const newQrCode = uuidv4();

    const updatedProfile = await prisma.profile.update({
      where: { userId: req.user.id },
      data: { qrCode: newQrCode }
    });

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const formUrl = `${baseUrl}/public/${newQrCode}`;

    const qrCodeDataUrl = await QRCode.toDataURL(formUrl, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 2,
      width: 512
    });

    res.json({
      message: 'QR Code regenerado com sucesso',
      qrCode: newQrCode,
      formUrl,
      qrCodeImage: qrCodeDataUrl
    });
  } catch (error) {
    console.error('Erro ao regenerar QR code:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Verificar QR code (público)
router.get('/verify/:qrCode', async (req, res) => {
  try {
    const { qrCode } = req.params;

    const profile = await prisma.profile.findUnique({
      where: { qrCode },
      select: {
        restaurantName: true,
        ownerName: true,
        description: true
      }
    });

    if (!profile) {
      return res.status(404).json({ error: 'QR Code inválido' });
    }

    res.json({
      valid: true,
      restaurant: profile
    });
  } catch (error) {
    console.error('Erro ao verificar QR code:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Estatísticas de uso do QR code
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalScans,
      scansThisMonth,
      conversionRate,
      dailyScans
    ] = await Promise.all([
      prisma.contact.count({
        where: {
          userId,
          source: 'qr_scan'
        }
      }),
      prisma.contact.count({
        where: {
          userId,
          source: 'qr_scan',
          createdAt: { gte: thirtyDaysAgo }
        }
      }),
      // Simular conversion rate (em um cenário real, você trackaria visualizações vs cadastros)
      85, // 85% de conversion rate mockada
      // Scans por dia nos últimos 7 dias
      prisma.contact.groupBy({
        by: ['createdAt'],
        where: {
          userId,
          source: 'qr_scan',
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        _count: {
          id: true
        }
      })
    ]);

    res.json({
      totalScans,
      scansThisMonth,
      conversionRate,
      growth: scansThisMonth > 0 ? '+12%' : '0%', // Mockado
      dailyScans: dailyScans.length
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas do QR:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;