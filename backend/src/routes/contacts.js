const express = require('express');
const { body, query } = require('express-validator');
const prisma = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Validações
const createContactValidation = [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('phone').isMobilePhone('any').withMessage('Telefone inválido'),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('countryCode').optional().isLength({ min: 2, max: 3 }).withMessage('Código do país inválido'),
  body('source').optional().isIn(['qr_scan', 'manual', 'import', 'api']).withMessage('Origem inválida'),
  body('tags').optional().isArray().withMessage('Tags devem ser um array'),
  body('notes').optional().isString().withMessage('Notas devem ser texto')
];

const updateContactValidation = [
  body('name').optional().notEmpty().withMessage('Nome não pode estar vazio'),
  body('phone').optional().isMobilePhone('any').withMessage('Telefone inválido'),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('tags').optional().isArray().withMessage('Tags devem ser um array'),
  body('notes').optional().isString().withMessage('Notas devem ser texto')
];

// Listar contatos com filtros e paginação
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search = '',
      source = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Construir filtros
    const where = {
      userId: req.user.id,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(source && { source })
    };

    // Buscar contatos
    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: offset,
        take: parseInt(limit)
      }),
      prisma.contact.count({ where })
    ]);

    // Processar tags (converter string JSON para array)
    const processedContacts = contacts.map(contact => ({
      ...contact,
      tags: contact.tags ? JSON.parse(contact.tags) : []
    }));

    res.json({
      contacts: processedContacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar contato por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const contact = await prisma.contact.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!contact) {
      return res.status(404).json({ error: 'Contato não encontrado' });
    }

    // Processar tags
    const processedContact = {
      ...contact,
      tags: contact.tags ? JSON.parse(contact.tags) : []
    };

    res.json(processedContact);
  } catch (error) {
    console.error('Erro ao buscar contato:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar contato
router.post('/', createContactValidation, handleValidationErrors, async (req, res) => {
  try {
    const { name, phone, email, countryCode, source, tags, notes } = req.body;

    // Verificar se contato já existe
    const existingContact = await prisma.contact.findFirst({
      where: {
        userId: req.user.id,
        phone
      }
    });

    if (existingContact) {
      return res.status(409).json({ error: 'Contato já existe com este telefone' });
    }

    const contact = await prisma.contact.create({
      data: {
        userId: req.user.id,
        name,
        phone,
        email,
        countryCode: countryCode || 'BR',
        source: source || 'manual',
        tags: tags ? JSON.stringify(tags) : null,
        notes
      }
    });

    // Processar response
    const processedContact = {
      ...contact,
      tags: contact.tags ? JSON.parse(contact.tags) : []
    };

    res.status(201).json({
      message: 'Contato criado com sucesso',
      contact: processedContact
    });
  } catch (error) {
    console.error('Erro ao criar contato:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar contato via QR (endpoint público)
router.post('/qr/:qrCode', createContactValidation, handleValidationErrors, async (req, res) => {
  try {
    const { qrCode } = req.params;
    const { name, phone, email, notes } = req.body;

    // Buscar perfil pelo QR code
    const profile = await prisma.profile.findUnique({
      where: { qrCode }
    });

    if (!profile) {
      return res.status(404).json({ error: 'QR Code inválido' });
    }

    // Verificar se contato já existe
    const existingContact = await prisma.contact.findFirst({
      where: {
        userId: profile.userId,
        phone
      }
    });

    if (existingContact) {
      return res.status(409).json({ error: 'Você já está cadastrado!' });
    }

    const contact = await prisma.contact.create({
      data: {
        userId: profile.userId,
        name,
        phone,
        email,
        source: 'qr_scan',
        notes
      }
    });

    res.status(201).json({
      message: 'Contato adicionado com sucesso!',
      contact: {
        id: contact.id,
        name: contact.name,
        restaurantName: profile.restaurantName
      }
    });
  } catch (error) {
    console.error('Erro ao criar contato via QR:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar contato
router.put('/:id', authenticateToken, updateContactValidation, handleValidationErrors, async (req, res) => {
  try {
    const { name, phone, email, tags, notes } = req.body;

    const updatedContact = await prisma.contact.updateMany({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(email !== undefined && { email }),
        ...(tags && { tags: JSON.stringify(tags) }),
        ...(notes !== undefined && { notes })
      }
    });

    if (updatedContact.count === 0) {
      return res.status(404).json({ error: 'Contato não encontrado' });
    }

    // Buscar contato atualizado
    const contact = await prisma.contact.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    const processedContact = {
      ...contact,
      tags: contact.tags ? JSON.parse(contact.tags) : []
    };

    res.json({
      message: 'Contato atualizado com sucesso',
      contact: processedContact
    });
  } catch (error) {
    console.error('Erro ao atualizar contato:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar contato
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deletedContact = await prisma.contact.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (deletedContact.count === 0) {
      return res.status(404).json({ error: 'Contato não encontrado' });
    }

    res.json({ message: 'Contato deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar contato:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Estatísticas de contatos
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [
      total,
      withEmail,
      viaQr,
      thisWeek
    ] = await Promise.all([
      prisma.contact.count({ where: { userId } }),
      prisma.contact.count({ where: { userId, email: { not: null } } }),
      prisma.contact.count({ where: { userId, source: 'qr_scan' } }),
      prisma.contact.count({
        where: {
          userId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    res.json({
      total,
      withEmail,
      viaQr,
      thisWeek
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;