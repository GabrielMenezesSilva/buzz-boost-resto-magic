# DopplerDine - Sistema Completo para Restaurantes 🍽️

Sistema all-in-one para restaurantes: marketing digital, geração de QR codes, coleta de contatos via formulários públicos, gestão de campanhas, analytics, controle de estoque (FEFO) e Ponto de Venda (POS) avançado operando totalmente na nuvem.

O projeto visa atingir um **estado da arte** impecável como plataforma multi-tenant segura para franquias e restaurantes independentes de alto padrão.

## 🏗️ Arquitetura e Stack

Abaixo as tecnologias utilizadas na concepção do sistema (após refatoração para "Serverless" e BaaS):

**Frontend:** React 18 + Vite + TypeScript 
**Styling:** Tailwind CSS + shadcn/ui + Framer Motion (para micro-animações)
**State Management:** Zustand + React Query (TanStack) 
**BaaS (Backend, Auth & Database):** Supabase (PostgreSQL 15) com Row Level Security (RLS)
**Hosting & Deploy:** Lovable / Vercel

Sustentamos um isolamento total de **Tenants** em nível de banco de dados (`auth.uid() = user_id`) assegurado por políticas estritas e auditadas internamente no Supabase.

---

## 🚀 Como Iniciar

### 1. Clonando e Instalando

```bash
git clone <URL_DO_REPOSITORIO>
cd buzz-boost-resto-magic
npm install
```

### 2. Variáveis de Ambiente
O projeto não utiliza mais um backend isolado em Express. Tudo se conecta ao Supabase via chaves do cliente. Crie um arquivo no root chamado `.env`:

```env
VITE_SUPABASE_URL="https://sua_url_aqui.supabase.co"
VITE_SUPABASE_ANON_KEY="sua_chave_anon_aqui"
```

### 3. Rodando Localmente

```bash
npm run dev
```

Linter para verificação de padrões:
```bash
npm run lint
```

---

## 📊 Módulos e Funcionalidades

1. **POS (Point of Sale)**
   Sessões robustas com múltiplos cartões/dinheiro, seleção de mesas visuais e grid otimizado e modularizado para alta performance em Tablets (Componentes: `POSCart`, `POSHeader`, `POSTablesGrid`, `POSProductsGrid`).
2. **Dashboard & Analytics**
   Dashboard refinado com métricas claras de performance, faturamento e ROI extraídas diretamente da base RLS de maneira segura.
3. **QR Code Lead Gen (Smart Promo)**
   Funcionalidade vital (QRForm e Public Form) que permite leitura instantânea na mesa do restaurante via web e a entrada do cliente para o funil CRM.
4. **CRM & Campanhas SMS**
   Gestão completa de templates e audiências (separadas por Tenant).
5. **Estoque (FEFO)**
   Registro e auditoria de movimentações baseada em *First Expired First Out*.

---

## 📁 Estrutura de Diretórios Refatorada

```text
src/
 ├── components/     # UI Dinâmica (Botões, Layout, Tabelas, Dialogs via shadcn/ui)
 │   ├── pos/        # Componentes particionados de vendas
 │   ├── dashboard/  # Gráficos e Analytics isolados
 │   ├── qr/         # Lógica isolada de escaneamento de QR
 │   ├── templates/  # Edição de design e templates
 │   └── ui/         # Base UI Componentes genéricos
 ├── hooks/          # Acesso a banco Supabase e React Queries customizados (DDD-lite)
 ├── pages/          # Rotas Container conectando hooks com os componentes (Smart/Dumb)
 ├── contexts/       # Language, Auth, UI Theme
 ├── lib/            # Utilitários compartihados gerais (como fetchers padrão)
 └── integracoes/    # Subpastas preparadas para SDKs e integrações
```

## 🔒 Segurança (Auditoria Recente)

- **RLS Habilitado:** Sim. O Banco isola 100% dos dados por Restaurante para tabelas de Vendas (Orders), Estoque (Stock Lots), Produtos e Contatos.`(auth.uid() = user_id)`.
- Uso do schema público limitou e restringiu privilégios desnecessários, exceto leads e landing pages das lojas.

## 📝 Licença
[MIT License](LICENSE)
