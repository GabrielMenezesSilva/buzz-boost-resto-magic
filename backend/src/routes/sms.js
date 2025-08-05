const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const { sendSMS, getSMSStatus } = require('../services/smsService');

const router = express.Router();

// Validações
const sendSMSValidation = [
  body('phone').isMobilePhone('any').withMessage('Telefone inválido'),
  body('message').notEmpty().withMessage('Mensagem é obrigatória'),
  body('message').isLength({ max: 1600 }).withMessage('Mensagem muito longa (máximo 1600 caracteres)')
];

// Enviar SMS individual
router.post('/send', authenticateToken, sendSMSValidation, handleValidationErrors, async (req, res) => {
  try {
    const { phone, message } = req.body;

    const result = await sendSMS(phone, message);

    if (result.success) {
      res.json({
        success: true,
        message: 'SMS enviado com sucesso',
        messageId: result.messageId,
        cost: result.cost
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Erro ao enviar SMS:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Verificar status de SMS
router.get('/status/:messageId', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;

    const status = await getSMSStatus(messageId);

    if (status.success) {
      res.json({
        success: true,
        status: status.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: status.error
      });
    }
  } catch (error) {
    console.error('Erro ao verificar status do SMS:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Testar configuração do SMS
router.post('/test', authenticateToken, async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Telefone é obrigatório' });
    }

    const testMessage = 'Este é um SMS de teste do DopplerDine. Se você recebeu esta mensagem, sua configuração está funcionando!';
    
    const result = await sendSMS(phone, testMessage);

    if (result.success) {
      res.json({
        success: true,
        message: 'SMS de teste enviado com sucesso',
        messageId: result.messageId,
        cost: result.cost
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Erro ao enviar SMS de teste:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Verificar configuração do Twilio
router.get('/config/check', authenticateToken, async (req, res) => {
  try {
    const isConfigured = !!(
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER
    );

    res.json({
      configured: isConfigured,
      accountSid: process.env.TWILIO_ACCOUNT_SID ? 
        `${process.env.TWILIO_ACCOUNT_SID.substring(0, 8)}...` : null,
      phoneNumber: process.env.TWILIO_PHONE_NUMBER || null,
      message: isConfigured ? 
        'Configuração do Twilio está completa' : 
        'Configure as variáveis TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN e TWILIO_PHONE_NUMBER'
    });
  } catch (error) {
    console.error('Erro ao verificar configuração:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;