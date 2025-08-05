# DopplerDine Backend

Backend Node.js completo para o sistema DopplerDine de marketing para restaurantes.

## 🚀 Tecnologias

- **Node.js** + **Express.js**
- **Prisma ORM** + **SQLite**
- **JWT** + **bcrypt**
- **Twilio SMS**
- **Resend Email**
- **QR Code generation**

## 📦 Instalação

```bash
cd backend
npm install
```

## ⚙️ Configuração

1. Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

2. Configure as variáveis no `.env`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"
TWILIO_PHONE_NUMBER="your-twilio-phone"
RESEND_API_KEY="your-resend-key"
```

## 🗄️ Banco de Dados

```bash
# Gerar cliente Prisma
npm run db:generate

# Criar banco e tabelas
npm run db:push

# Seed inicial (opcional)
npm run db:seed
```

## 🏃‍♂️ Executar

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📊 API Endpoints

### Auth
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário

### Contatos
- `GET /api/contacts` - Listar contatos
- `POST /api/contacts` - Criar contato
- `POST /api/contacts/qr/:qrCode` - Criar via QR (público)

### Campanhas
- `GET /api/campaigns` - Listar campanhas
- `POST /api/campaigns` - Criar campanha
- `POST /api/campaigns/:id/send` - Enviar campanha

### QR Code
- `GET /api/qr/generate` - Gerar QR code
- `GET /api/qr/verify/:qrCode` - Verificar QR (público)

### Analytics
- `GET /api/analytics/dashboard` - Dashboard
- `GET /api/analytics/contacts` - Analytics de contatos
- `GET /api/analytics/campaigns` - Analytics de campanhas

## 🔧 Usuário de Teste

Após o seed:
- **Email:** admin@dopplerdine.com
- **Senha:** 123456

## 📱 Frontend Integration

Configure no frontend React:
```javascript
const API_BASE_URL = 'http://localhost:3001/api';
```

✅ **Backend Node.js completo implementado!**