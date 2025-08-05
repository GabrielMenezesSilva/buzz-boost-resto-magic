# DopplerDine - Sistema de Marketing para Restaurantes

Sistema completo de marketing digital para restaurantes com geração de QR codes, coleta de contatos via formulários públicos, gestão de campanhas SMS e templates personalizáveis.

## 🏗️ Arquitetura

**Frontend:** React + TypeScript + Vite + Tailwind CSS  
**Backend:** Node.js + Express + Prisma + SQLite  
**Autenticação:** JWT (JSON Web Tokens)  
**SMS:** Integração com provedores SMS  
**QR Codes:** Geração automática para coleta de contatos

## 🚀 Tecnologias

### Frontend
- **React 18** com TypeScript
- **Vite** para build rápido e desenvolvimento
- **Tailwind CSS** para estilização
- **shadcn/ui** componentes acessíveis
- **React Router** para navegação
- **Axios** para requisições HTTP

### Backend
- **Node.js** + **Express.js**
- **Prisma ORM** + **SQLite**
- **JWT** + **bcrypt**
- **Twilio SMS** + **Resend Email**
- **QR Code** generation

## 📦 Instalação

### 1. Clone o repositório
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

### 2. Configure o Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure as variáveis no .env
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

### 3. Configure o Frontend
```bash
# Em outro terminal, volte para a raiz
cd ..
npm install

# Configure variáveis de ambiente
cp .env.example .env
# Edite o .env com: VITE_API_URL=http://localhost:3001/api

npm run dev
```

## ⚙️ Configuração

### Backend (.env)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"
TWILIO_PHONE_NUMBER="your-twilio-phone"
RESEND_API_KEY="your-resend-key"
PORT=3001
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## 🔧 Usuário de Teste

Após executar o seed do backend:
- **Email:** admin@dopplerdine.com
- **Senha:** 123456

## 📊 Funcionalidades

- ✅ **Autenticação JWT**
- ✅ **Gestão de Perfil do Restaurante**
- ✅ **Captação de Contatos via QR Code**
- ✅ **Criação e Envio de Campanhas SMS**
- ✅ **Templates de Mensagens**
- ✅ **Analytics e Dashboard**
- ✅ **Integração Twilio SMS**
- ✅ **Geração de QR Codes**

## 🔗 API Endpoints

### Auth
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário

### Contatos
- `GET /api/contacts` - Listar contatos
- `POST /api/contacts` - Criar contato
- `POST /api/contacts/qr/:qrCode` - Criar via QR

### Campanhas
- `GET /api/campaigns` - Listar campanhas
- `POST /api/campaigns` - Criar campanha
- `POST /api/campaigns/:id/send` - Enviar campanha

### QR Code
- `GET /api/qr/generate` - Gerar QR code
- `GET /api/qr/verify/:qrCode` - Verificar QR

## 🏃‍♂️ Scripts Disponíveis

### Frontend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
```

### Backend
```bash
npm run dev          # Desenvolvimento
npm start            # Produção
npm run db:generate  # Gerar cliente Prisma
npm run db:push      # Aplicar schema
npm run db:studio    # Prisma Studio
npm run db:seed      # Seed inicial
```

## 📁 Estrutura do Projeto

```
├── src/                 # Frontend React
│   ├── components/      # Componentes UI
│   ├── pages/          # Páginas da aplicação
│   ├── hooks/          # Custom hooks
│   └── services/       # API services (axios)
├── backend/            # Backend Node.js
│   ├── src/
│   │   ├── routes/     # Rotas da API
│   │   ├── middleware/ # Middlewares
│   │   ├── services/   # Serviços (SMS, Email)
│   │   └── utils/      # Utilitários
│   └── prisma/         # Schema do banco
```

## 🚀 Deploy

### Frontend
Deploy automaticamente via [Lovable](https://lovable.dev)

### Backend
Pode ser deployado em qualquer plataforma Node.js:
- Railway
- Render
- Heroku
- VPS próprio

## 📝 Licença

MIT License
