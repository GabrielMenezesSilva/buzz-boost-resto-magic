const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário de teste
  const hashedPassword = await bcrypt.hash('123456', 12);
  
  const user = await prisma.user.create({
    data: {
      email: 'admin@dopplerdine.com',
      password: hashedPassword,
      profile: {
        create: {
          restaurantName: 'Restaurante Exemplo',
          ownerName: 'João Silva',
          phone: '+5511999999999',
          description: 'Um restaurante incrível para testar o sistema'
        }
      }
    },
    include: { profile: true }
  });

  // Criar templates padrão
  const templates = [
    {
      name: 'Boas-vindas',
      message: 'Olá {{nome}}! Bem-vindo ao {{restaurante}}. Obrigado por se cadastrar!',
      category: 'welcome',
      variables: JSON.stringify(['nome', 'restaurante'])
    },
    {
      name: 'Promoção Semanal',
      message: 'Oi {{nome}}! Temos uma promoção especial esta semana: {{descricao}}. Não perca!',
      category: 'promotion',
      variables: JSON.stringify(['nome', 'descricao'])
    }
  ];

  for (const template of templates) {
    await prisma.campaignTemplate.create({
      data: {
        ...template,
        userId: user.id
      }
    });
  }

  console.log('✅ Seed concluído!');
  console.log(`👤 Usuário criado: ${user.email}`);
  console.log(`🏪 Restaurante: ${user.profile.restaurantName}`);
  console.log(`🔑 QR Code: ${user.profile.qrCode}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });