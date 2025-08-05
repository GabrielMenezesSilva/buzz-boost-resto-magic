const express = require('express');
const { body } = require('express-validator');
const prisma = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Validações
const updateProfileValidation = [
  body('restaurantName').optional().notEmpty().withMessage('Nome do restaurante não pode estar vazio'),
  body('ownerName').optional().notEmpty().withMessage('Nome do proprietário não pode estar vazio'),
  body('phone').optional().isMobilePhone('any').withMessage('Telefone inválido'),
  body('email').optional().isEmail().withMessage('Email inválido')
];

// Buscar perfil do usuário logado
router.get('/', authenticateToken, async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar perfil por QR code (público)
router.get('/qr/:qrCode', async (req, res) => {
  try {
    const { qrCode } = req.params;

    const profile = await prisma.profile.findUnique({
      where: { qrCode },
      select: {
        id: true,
        restaurantName: true,
        ownerName: true,
        qrCode: true,
        description: true
      }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Restaurante não encontrado' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Erro ao buscar perfil por QR:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar perfil
router.put('/', authenticateToken, updateProfileValidation, handleValidationErrors, async (req, res) => {
  try {
    const { restaurantName, ownerName, phone, address, description } = req.body;

    const updatedProfile = await prisma.profile.update({
      where: { userId: req.user.id },
      data: {
        restaurantName,
        ownerName,
        phone,
        address,
        description
      }
    });

    res.json({
      message: 'Perfil atualizado com sucesso',
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }
    
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Regenerar QR code
router.post('/regenerate-qr', authenticateToken, async (req, res) => {
  try {
    const { v4: uuidv4 } = require('uuid');
    const newQrCode = uuidv4();

    const updatedProfile = await prisma.profile.update({
      where: { userId: req.user.id },
      data: { qrCode: newQrCode }
    });

    res.json({
      message: 'QR Code regenerado com sucesso',
      qrCode: updatedProfile.qrCode
    });
  } catch (error) {
    console.error('Erro ao regenerar QR code:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;