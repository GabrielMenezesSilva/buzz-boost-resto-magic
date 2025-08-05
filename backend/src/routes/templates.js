const express = require('express');
const { body } = require('express-validator');
const prisma = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Validações
const createTemplateValidation = [
  body('name').notEmpty().withMessage('Nome do template é obrigatório'),
  body('message').notEmpty().withMessage('Mensagem é obrigatória'),
  body('category').optional().isIn(['general', 'promotion', 'welcome', 'reminder', 'event']).withMessage('Categoria inválida'),
  body('variables').optional().isArray().withMessage('Variáveis devem ser um array')
];

// Listar templates
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category = '', search = '' } = req.query;

    const where = {
      userId: req.user.id,
      ...(category && { category }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { message: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const templates = await prisma.campaignTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    const processedTemplates = templates.map(template => ({
      ...template,
      variables: template.variables ? JSON.parse(template.variables) : []
    }));

    res.json(processedTemplates);
  } catch (error) {
    console.error('Erro ao buscar templates:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar template por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const template = await prisma.campaignTemplate.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!template) {
      return res.status(404).json({ error: 'Template não encontrado' });
    }

    const processedTemplate = {
      ...template,
      variables: template.variables ? JSON.parse(template.variables) : []
    };

    res.json(processedTemplate);
  } catch (error) {
    console.error('Erro ao buscar template:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar template
router.post('/', authenticateToken, createTemplateValidation, handleValidationErrors, async (req, res) => {
  try {
    const { name, message, category = 'general', variables } = req.body;

    const template = await prisma.campaignTemplate.create({
      data: {
        userId: req.user.id,
        name,
        message,
        category,
        variables: variables ? JSON.stringify(variables) : null
      }
    });

    res.status(201).json({
      message: 'Template criado com sucesso',
      template: {
        ...template,
        variables: template.variables ? JSON.parse(template.variables) : []
      }
    });
  } catch (error) {
    console.error('Erro ao criar template:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar template
router.put('/:id', authenticateToken, createTemplateValidation, handleValidationErrors, async (req, res) => {
  try {
    const { name, message, category, variables } = req.body;

    const updatedTemplate = await prisma.campaignTemplate.updateMany({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      data: {
        name,
        message,
        category,
        variables: variables ? JSON.stringify(variables) : null
      }
    });

    if (updatedTemplate.count === 0) {
      return res.status(404).json({ error: 'Template não encontrado' });
    }

    // Buscar template atualizado
    const template = await prisma.campaignTemplate.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    res.json({
      message: 'Template atualizado com sucesso',
      template: {
        ...template,
        variables: template.variables ? JSON.parse(template.variables) : []
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar template:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar template
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Verificar se template está em uso
    const campaignsUsingTemplate = await prisma.campaign.count({
      where: {
        templateId: req.params.id,
        userId: req.user.id
      }
    });

    if (campaignsUsingTemplate > 0) {
      return res.status(400).json({ 
        error: 'Template não pode ser deletado pois está sendo usado em campanhas' 
      });
    }

    const deletedTemplate = await prisma.campaignTemplate.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (deletedTemplate.count === 0) {
      return res.status(404).json({ error: 'Template não encontrado' });
    }

    res.json({ message: 'Template deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar template:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Duplicar template
router.post('/:id/duplicate', authenticateToken, async (req, res) => {
  try {
    const originalTemplate = await prisma.campaignTemplate.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!originalTemplate) {
      return res.status(404).json({ error: 'Template não encontrado' });
    }

    const duplicatedTemplate = await prisma.campaignTemplate.create({
      data: {
        userId: req.user.id,
        name: `${originalTemplate.name} (Cópia)`,
        message: originalTemplate.message,
        category: originalTemplate.category,
        variables: originalTemplate.variables
      }
    });

    res.status(201).json({
      message: 'Template duplicado com sucesso',
      template: {
        ...duplicatedTemplate,
        variables: duplicatedTemplate.variables ? JSON.parse(duplicatedTemplate.variables) : []
      }
    });
  } catch (error) {
    console.error('Erro ao duplicar template:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;