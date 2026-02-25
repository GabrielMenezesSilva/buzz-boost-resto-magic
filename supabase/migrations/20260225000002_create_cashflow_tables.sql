-- Criação de Tabelas da Fase 3 (Fluxo de Caixa e Relatórios)
-- Categorias de Despesa/Receita e Lançamentos Financeiros

-- 1. Expense Categories (Categorias de Receitas/Despesas)
CREATE TABLE IF NOT EXISTS expense_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    color TEXT DEFAULT '#808080',
    is_system BOOLEAN DEFAULT false, -- Categorias do sistema não podem ser deletadas
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Cash Flow Entries (Movimentações Financeiras)
CREATE TABLE IF NOT EXISTS cash_flow_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    category_id UUID REFERENCES expense_categories(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    description TEXT NOT NULL,
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method TEXT, -- 'cash', 'credit', 'debit', 'pix', 'transfer', 'other'
    reference_id UUID,   -- ID de outra tabela (ex: order_id, stock_movement_id)
    reference_type TEXT, -- 'order', 'purchase', 'manual'
    is_recurring BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ativar RLS
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_flow_entries ENABLE ROW LEVEL SECURITY;

-- Políticas de Privacidade de Linhas (RLS Policies) para o dono das tabelas
CREATE POLICY "Users can manage their own expense categories" 
ON expense_categories FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own cash flow entries" 
ON cash_flow_entries FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Inserir categorias padrão automaticamente para todos os profiles existentes (opcional, ou via application code/trigger)
-- Adicionado um trigger para inserir categorias padrao via profiles insert não é o ideal aqui pois seria retroativo.
-- Ao invez disso, vamos deixar o App inserir "Vendas POS" se ela não existir.
