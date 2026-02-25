-- Migration: Add Automatic Flow from POS to Cash Flow
-- Cria trigger para inserir entrada no cash_flow_entries quando um order for completado

CREATE OR REPLACE FUNCTION public.handle_order_completion_to_cashflow()
RETURNS TRIGGER AS $$
BEGIN
    -- Se o status do order mudou para 'completed'
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        
        -- Obtém a categoria 'Vendas POS' ou usa null se não achar
        DECLARE
            v_category_id UUID;
        BEGIN
            SELECT id INTO v_category_id FROM public.expense_categories 
            WHERE user_id = NEW.user_id AND type = 'income' AND name ILIKE '%Venda%' LIMIT 1;

            -- Se a categoria padrão não existir, cria uma silently para manter a integridade
            IF v_category_id IS NULL THEN
                INSERT INTO public.expense_categories (user_id, name, type, color)
                VALUES (NEW.user_id, 'Vendas POS', 'income', '#10b981')
                RETURNING id INTO v_category_id;
            END IF;

            -- Insere o montante do pedido no Fluxo de Caixa
            INSERT INTO public.cash_flow_entries (
                user_id,
                type,
                amount,
                description,
                entry_date,
                payment_method,
                category_id,
                reference_type,
                reference_id
            )
            VALUES (
                NEW.user_id,
                'income',
                NEW.total,
                'Venda Aut. POS (Mesa ' || COALESCE(NEW.table_number, 'Balcão') || ')',
                CURRENT_DATE,
                COALESCE(NEW.payment_method, 'other'),
                v_category_id,
                'order',
                NEW.id::text
            );
        END;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atacha o trigger na tabela orders
DROP TRIGGER IF EXISTS tr_order_completion_cashflow ON public.orders;
CREATE TRIGGER tr_order_completion_cashflow
    AFTER UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_order_completion_to_cashflow();

-- Opcional: Trigger para compras no Estoque (Stock Movements Type = 'in' com custo associado)
-- Como o modulo atual registra só movimento e não "Invoice", a integração de saída será anotada nos requirements para Phase 5 caso incluamos Módulo de Compras ("Purchases").

