# DopplerDine — Guia para Claude Code

SaaS multi-tenant de gestão e marketing para restaurantes. Mercado: Genève, Suíça.
Backlog completo: `~/Documents/Claude/Projects/Doppler Dine/TASKS.md`

---

## 🔴 Regras de Ouro — NUNCA violar

1. **Zero `any` no TypeScript** — usar sempre tipos estritos. Gerar tipos via `supabase gen types typescript`. Proibido: `as any`, `any[]`, `: any`.
2. **Moeda sempre CHF** — nunca EUR, USD ou outra. Usar `utils/currency.ts` para formatação.
3. **Interface do utilizador em francês** — todos os textos visíveis ao utilizador em FR. Usar `useLanguage() → t('chave')`. Nunca hardcodar strings em PT ou EN.
4. **RLS obrigatório** — cada tabela Supabase com policy `auth.uid() = user_id`. Dados isolados por tenant.
5. **PIN verificado no backend** — nunca comparar PIN no browser. Usar RPC Supabase `verify_employee_pin`.
6. **FEFO para baixa de stock** — First Expired, First Out. Sair sempre do lote com menor `expiry_date`.
7. **WCAG 2.2** — aria-labels, contraste mín. 4.5:1, touch targets ≥ 44px, navegação por teclado.
8. **Z-Pattern nas páginas de conversão** — landing, onboarding, planos.

---

## Stack

```
Frontend:  React 18 · Vite · TypeScript strict · Tailwind CSS · shadcn/ui · Framer Motion
Estado:    Zustand (carrinho POS) + React Query (dados servidor)
Backend:   Supabase (PostgreSQL 15 + RLS + Edge Functions + Realtime)
Auth:      Supabase Auth
Deploy:    Vercel
Testes:    Vitest (alvo: 80% coverage)
```

---

## Roles RBAC

| Role | Acesso |
|------|--------|
| `super_admin` | Tudo + `/admin` (Gabriel — platform owner) |
| `user` / `manager` | Dashboard, POS, CRM, Campanhas, Inventário |
| `cashier` | POS, Orders, CashFlow |
| `waiter` | POS (apenas envio de bons) |

Proteção via `ProtectedRoute` com `allowedRoles[]`. Funcionários acedem via PIN (login por cima da sessão do restaurador).

---

## Estrutura de ficheiros chave

```
src/
├── hooks/
│   ├── useAuth.tsx          # Auth + activeEmployee + loginAsEmployee()
│   ├── useOrders.tsx        # ⚠️ TEM any — processCheckout + processPayment
│   ├── usePosSession.tsx    # ⚠️ TEM any — open/close sessão POS
│   ├── useCampaigns.tsx     # sendCampaign() → chama Edge Fn 'send-campaign'
│   ├── useTables.tsx        # Mesas do restaurante
│   └── useCart.tsx          # Carrinho Zustand
├── components/
│   ├── pos/
│   │   ├── EmployeeLoginModal.tsx  # ⚠️ PIN comparado no client — CORRIGIR
│   │   ├── POSTablesGrid.tsx
│   │   ├── POSProductsGrid.tsx
│   │   ├── POSOrdersGrid.tsx
│   │   ├── POSCart.tsx
│   │   └── OrderPaymentModal.tsx
│   └── campaigns/
│       ├── CampaignForm.tsx        # Campo `filters` não preenchido ainda
│       └── CampaignList.tsx
├── pages/
│   ├── POS.tsx              # Página principal POS
│   ├── PublicForm.tsx       # Formulário público QR (cliente)
│   ├── Onboarding.tsx       # Wizard 4 etapas
│   └── Campaigns.tsx
├── integrations/supabase/
│   ├── client.ts
│   └── types.ts             # Tipos gerados — manter actualizados
├── types/pos.ts             # Employee, Order, OrderItem, Payment, PosSession
└── utils/currency.ts        # Formatação CHF
```

---

## Backlog de Desenvolvimento

> Marcar como `[x]` quando concluído. Consultar sempre antes de iniciar uma tarefa.

---

### 🔴 P0 — CRITIQUE · Bloqueante para Produção (~8h)

- [ ] **[SEC] PIN no backend** — `EmployeeLoginModal.tsx` · PIN comparado no browser atualmente (falla crítica — todos os PINs descarregados no client)
  ```sql
  CREATE FUNCTION verify_employee_pin(p_employee_id uuid, p_pin text)
  RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
    SELECT EXISTS (SELECT 1 FROM employees WHERE id = p_employee_id AND pin = p_pin AND active = true);
  $$;
  ```
  Chamar `supabase.rpc('verify_employee_pin', { p_employee_id, p_pin })`. Remover fetch de employees com PINs incluídos.

- [ ] **[RT] Supabase Realtime — `orders`** — `useOrders.tsx` · Garçon envia bon → caisse não vê sem refresh manual (bloqueia uso em sala)
  ```typescript
  const channel = supabase
    .channel('orders-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${user.id}` },
      () => queryClient.invalidateQueries({ queryKey: ['activeOrders'] }))
    .subscribe()
  return () => { supabase.removeChannel(channel) }
  ```
  Ativar Realtime no dashboard Supabase para a tabela `orders`.

- [ ] **[RT] Supabase Realtime — `restaurant_tables`** — `useTables.tsx` · Mesmo padrão acima para a tabela `restaurant_tables`. Ativar Realtime no Supabase.

- [ ] **[TS] Eliminar `supabase as any`** — `useOrders.tsx` linha 4 · `usePosSession.tsx` linha 4
  ```bash
  npx supabase gen types typescript --project-id <PROJECT_ID> > src/integrations/supabase/database.types.ts
  ```
  Substituir por `supabase as SupabaseClient<Database>`.

- [ ] **[TS] Eliminar `cartItems: any[]`** — `useOrders.tsx` linhas 213 e 224 · Substituir por `CartItem[]` (tipo já existe em `useCart.tsx`).

---

### 🟠 P1 — ALTA · Cerne do Produto — SmartPromo (~15h)

- [ ] **[WA] Setup Meta WhatsApp Cloud API** — Criar App em `developers.facebook.com` → produto WhatsApp Business → obter `WHATSAPP_TOKEN` + `PHONE_NUMBER_ID` → `supabase secrets set WHATSAPP_TOKEN=xxx`. Gratuito até 1000 conversas/mês. Aprovação Meta: 24-48h.

- [ ] **[WA] Edge Function `send-campaign`** — Criar `supabase/functions/send-campaign/index.ts`
  - Recebe `{ campaignId }` → carrega campanha + filtra contactos → loop: `POST https://graph.facebook.com/v18.0/{PHONE_ID}/messages` por contacto
  - Após envio: `UPDATE campaigns SET status='sent', sent_at=now(), successful_sends=N, failed_sends=M`
  - Já referenciada em `useCampaigns.tsx → sendCampaign()`

- [ ] **[WA] Scheduler pg_cron** — Ativar extensão `pg_cron` no Supabase → job a cada 5 min: busca `campaigns WHERE scheduled_at <= now() AND status='draft'` → invoca Edge Function `send-campaign`.

- [ ] **[CRM] UI de seleção de destinatários** — `CampaignForm.tsx` · Adicionar campo "Enviar para": Todos / filtro por data / filtro por tag. Preencher campo `filters` em DB (já existe no schema).

- [ ] **[DB] Verificar migração `onboarding_completed`** — Confirmar no Supabase SQL Editor que a coluna `profiles.onboarding_completed BOOLEAN` existe. Se não, criar migration.

---

### 🟡 P2 — MÉDIA · Qualidade & Compliance (~17h)

- [ ] **[I18N] Traduzir toasts/textos hardcoded para francês** — Usar `useLanguage() → t('chave')` para:
  - `usePosSession.tsx` — "Caixa aberto/fechado com sucesso"
  - `useAuth.tsx` — "Erro no cadastro", "Logout realizado"
  - `EmployeeLoginModal.tsx` — "Acesso de Colaborador", "Digite seu PIN"
  - `Onboarding.tsx` — "Ganhe um brinde!", textos QR padrão

- [ ] **[UX] Guard redirect Onboarding** — `Onboarding.tsx` · Se `profile?.onboarding_completed === true` → `navigate('/dashboard')` imediatamente.

- [ ] **[FEFO] Tabela `product_lots`** — Schema: `(id, product_id, user_id, quantity, expiry_date, cost_price, created_at)` + RLS. UI de entrada de stock com data de validade. `useOrders.tsx → processPayment`: deduzir sempre do lote com menor `expiry_date`.

- [ ] **[POS] Relatório de fecho detalhado** — `usePosSession.tsx → closeSession` · Antes de fechar, agregar payments da sessão: `total_cash`, `total_card`, `total_pix`, `total_sales`, `total_orders`. Guardar em `pos_sessions`. Mostrar resumo visual antes de confirmar.

- [ ] **[PHONE] Validação telefone com libphonenumber-js** — `PublicForm.tsx` · Substituir regex manual por `isValidPhoneNumber(phone)` de `libphonenumber-js`. Suporta +41, +55 e todos os formatos internacionais.

- [ ] **[SEC] Auditar políticas RLS** — Supabase SQL Editor → verificar:
  - `contacts`: INSERT anónimo OK, SELECT apenas por `user_id` do restaurante
  - `orders`, `products`, `employees`: `auth.uid() = user_id` em todas as operações
  - Testar cross-tenant: user A não pode ver dados de user B

- [ ] **[SEC] Timeout de sessão PIN** — `POS.tsx` ou `useAuth.tsx` · Timer de inatividade (ex: 15 min) → `loginAsEmployee(null)` → modal PIN reaparece.

---

### 🟢 P3 — BAIXA · Melhorias & Futuro (~46h)

- [ ] **[CI] GitHub Actions pipeline** — `.github/workflows/ci.yml`: lint → `tsc --noEmit` → Vitest → build → deploy Vercel automático ao push na main.

- [ ] **[CRM] Segmentação de contactos — Tags + Filtros** — `Contacts.tsx` · Campos `tags[]`, `visit_count` na tabela `contacts`. UI de filtros por tag, por data de última visita, por frequência.

- [ ] **[POS] Kitchen Display System (KDS)** — Nova rota `/kitchen` · Exibe orders `status='open'` em Realtime, sem auth complexa. Botão "Pronto" → `status='ready'` → notifica caisse.

- [ ] **[BILLING] Stripe + Planos CHF** — `Plans.tsx` → Stripe Checkout (Starter CHF 79/m, PRO CHF 179/m) + Webhook → `profiles.plan`. Enforçar limites: Starter = 2000 contactos max.

- [ ] **[ADMIN] Panel super_admin multi-tenant** — `Admin.tsx` · Vista global: todos os restaurantes, MRR CHF, contactos captados, campanhas enviadas, churn.

- [ ] **[CRM] QR Code por mesa** — Parâmetro `?table=5` no QR → guardar `contacts.source_table` ao submeter formulário. Analytics de qual mesa converte mais.

- [ ] **[SEC] PIN com bcrypt** — Hashear PINs em `employees.pin` com bcrypt. Adaptar RPC `verify_employee_pin` para usar `crypt()`.

- [ ] **[TEST] Coverage Vitest 80%** — Testes para: `useOrders` (processCheckout, processPayment), `useCart`, `useCampaigns`, `PublicForm` (validação Zod), `utils/currency.ts`.

---

### ✅ Já Feito — Referência

- [x] Auth Supabase (signUp, signIn, signOut) — `useAuth.tsx`
- [x] Onboarding wizard 4 etapas — `Onboarding.tsx`
- [x] QR Code gerado + download PNG + impressão — `QRGenerator.tsx · PrintQR.tsx`
- [x] Formulário público — Zod, anti-duplo, RGPD, insert contactos — `PublicForm.tsx`
- [x] CRUD: Produtos, Categorias, Fornecedores, Mesas, Funcionários
- [x] POS: sessão, grid produtos/mesas/orders, carrinho Zustand — `POS.tsx · useCart.tsx`
- [x] Pagamento 4 métodos + baixa stock + cash flow automáticos — `useOrders.tsx`
- [x] RBAC + ProtectedRoute por role — `ProtectedRoute.tsx`
- [x] Login PIN funcionário (UI) — `EmployeeLoginModal.tsx`
- [x] Campanhas UI: formulário, templates, scheduled_at em DB — `CampaignForm.tsx`
- [x] Dashboard + Analytics + Reports + CashFlow
- [x] Landing Z-Pattern + Plans CHF — `Home.tsx · Plans.tsx`
- [x] Alertas de stock mínimo — `useInventoryAlerts.tsx`
- [x] Sistema de traduções i18n — `LanguageContext.tsx`

---

## Padrões de código

```typescript
// ✅ Correcto — sem any
import type { Database } from '@/integrations/supabase/types'
const { data } = await supabase
  .from('orders')
  .select('*, order_items(*)')
  .returns<OrderWithItems[]>()

// ❌ Proibido
const db = supabase as any
const items: any[] = []

// ✅ Correcto — texto em francês via i18n
const { t } = useLanguage()
toast.success(t('pos.sessionOpened'))

// ❌ Proibido — hardcoded em PT
toast.success('Caixa aberto com sucesso')

// ✅ Correcto — CHF
import { formatCHF } from '@/utils/currency'
<span>{formatCHF(order.total)}</span>

// ❌ Proibido
<span>€{order.total}</span>
```

---

## Comandos úteis

```bash
npm run dev          # Iniciar dev server
npm run build        # Build produção
npm run test         # Vitest
npm run lint         # ESLint — deve passar com 0 erros
npx tsc --noEmit     # Typecheck — deve passar com 0 erros e 0 any

# Supabase
npx supabase start              # Dev local
npx supabase db push            # Aplicar migrations
npx supabase functions serve    # Edge Functions local
npx supabase gen types typescript --project-id <ID> > src/integrations/supabase/types.ts
```

---

## Contexto de negócio

- **Clientes alvo**: restaurantes de alto padrão em Genève
- **Fluxo principal**: QR na mesa → cliente preenche form → vira contact → recebe campanha WhatsApp
- **POS**: garçon seleciona mesa → adiciona produtos → envia bon → caisse paga → stock e cash flow atualizados automaticamente
- **Planos**: Starter CHF 79/mês · PRO CHF 179/mês · Add-ons CHF 49-120
- **Autenticação dupla**: restaurador faz login normal Supabase Auth; funcionários fazem login por PIN por cima dessa sessão
