-- Criação de Tabelas da Fase 2 (PDV)
-- Ponto de Venda, Mesas, Pedidos, Itens de Pedido e Pagamentos

-- 1. Employees (Funcionários)
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'waiter', -- 'owner', 'manager', 'cashier', 'waiter'
    phone TEXT,
    pin TEXT, -- PIN numérico para uso rápido no PDV da loja
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Restaurant Tables (Mesas do Restaurante)
CREATE TABLE IF NOT EXISTS restaurant_tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- Exemplo: 'Mesa 1', 'Balcão', 'Delivery'
    status TEXT NOT NULL DEFAULT 'available', -- 'available', 'occupied', 'reserved'
    capacity INTEGER DEFAULT 4,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. POS Sessions (Sessões de Caixa / Turnos)
CREATE TABLE IF NOT EXISTS pos_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    opening_balance DECIMAL(10,2) DEFAULT 0.00,
    closing_balance DECIMAL(10,2),
    total_sales DECIMAL(10,2) DEFAULT 0.00,
    total_cash DECIMAL(10,2) DEFAULT 0.00,
    total_card DECIMAL(10,2) DEFAULT 0.00,
    total_pix DECIMAL(10,2) DEFAULT 0.00,
    total_orders INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'open', -- 'open' (Aberto), 'closed' (Fechado)
    opened_at TIMESTAMPTZ DEFAULT now(),
    closed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Orders (Pedidos / Comandas)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES pos_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    table_id UUID REFERENCES restaurant_tables(id) ON DELETE SET NULL,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    order_number SERIAL,
    status TEXT NOT NULL DEFAULT 'open', -- 'open', 'preparing', 'ready', 'completed', 'cancelled'
    order_type TEXT NOT NULL DEFAULT 'dine_in', -- 'dine_in' (no local), 'takeout' (para viagem), 'delivery'
    subtotal DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_percent DECIMAL(5,2) DEFAULT 0.00,
    total DECIMAL(10,2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ
);

-- 5. Order Items (Itens do Pedido)
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL, -- Snapshot (Cópia do nome do momento da venda)
    unit_price DECIMAL(10,2) NOT NULL, -- Snapshot (Cópia do preço do momento da venda)
    quantity DECIMAL(10,3) NOT NULL DEFAULT 1.000,
    subtotal DECIMAL(10,2) NOT NULL,
    notes TEXT, -- Observações, ex: "Sem cebola"
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Payments (Pagamentos)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    method TEXT NOT NULL, -- 'cash', 'credit', 'debit', 'pix', 'other'
    amount DECIMAL(10,2) NOT NULL,
    change_given DECIMAL(10,2) DEFAULT 0.00,
    reference TEXT, -- ID de transação da maquininha ou app bancário (opcional)
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Ativar RLS (Row Level Security) em Todas as Novas Tabelas
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Políticas de Privacidade de Linhas (RLS Policies) para o dono das tabelas
CREATE POLICY "Users can manage their own employees" 
ON employees FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own tables" 
ON restaurant_tables FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own sessions" 
ON pos_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own orders" 
ON orders FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Para Filhos Diretos (Items e Pagamentos), associamos através do pedido (order_id)
CREATE POLICY "Users can view order items for their orders" 
ON order_items FOR ALL USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
) WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

CREATE POLICY "Users can view payments for their orders" 
ON payments FOR ALL USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = payments.order_id AND orders.user_id = auth.uid())
) WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = payments.order_id AND orders.user_id = auth.uid())
);
