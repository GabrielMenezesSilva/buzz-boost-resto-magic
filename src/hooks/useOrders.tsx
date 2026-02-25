import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
const supabaseDb = supabase as any;
import { useAuth } from '@/hooks/useAuth';
import { Order, OrderItem, Payment } from '@/types/pos';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export const useOrders = (sessionId?: string) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { t } = useLanguage();

    // Buscar todos os pedidos abertos/em andamento
    const getActiveOrders = async (): Promise<Order[]> => {
        if (!user) return [];

        let query = supabaseDb
            .from('orders')
            .select('*, order_items(*), payments(*)')
            .neq('status', 'completed')
            .neq('status', 'cancelled')
            .order('created_at', { ascending: false });

        if (sessionId) {
            query = query.eq('session_id', sessionId);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data as any[];
    };

    const { data: activeOrders = [], isLoading: isLoadingActive } = useQuery({
        queryKey: ['activeOrders', user?.id, sessionId],
        queryFn: getActiveOrders,
        enabled: !!user,
    });

    // Criar novo pedido
    const createOrder = useMutation({
        mutationFn: async (orderInput: Partial<Order>) => {
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabaseDb
                .from('orders')
                .insert([{
                    ...orderInput,
                    user_id: user.id,
                    status: 'open',
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activeOrders'] });
            toast.success(t('toast.orderSuccess') || 'Pedido enviado com sucesso!');
        },
        onError: (error) => {
            toast.error((t('toast.orderError') || 'Erro ao enviar pedido: ') + error.message);
        }
    });

    // Adicionar Item a um Pedido
    const addOrderItem = useMutation({
        mutationFn: async (item: Omit<OrderItem, 'id' | 'created_at' | 'updated_at'>) => {
            const { data, error } = await supabaseDb
                .from('order_items')
                .insert([item])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['activeOrders'] });
            toast.success('Item adicionado');
        }
    });

    // Finalizar e Pagar Pedido
    const processPayment = useMutation({
        mutationFn: async (paymentData: Omit<Payment, 'id' | 'created_at'> & { total_order: number }) => {
            const { total_order, ...payment } = paymentData;

            // 0. Fetch items to deduct stock
            const { data: items } = await supabaseDb
                .from('order_items')
                .select('product_id, quantity, product_name')
                .eq('order_id', payment.order_id);

            // 1. Registra pagamento
            const { data: payData, error: payError } = await supabaseDb
                .from('payments')
                .insert([payment])
                .select()
                .single();

            if (payError) throw payError;

            // 2. Fecha o Pedido
            const { error: orderError } = await supabaseDb
                .from('orders')
                .update({ status: 'completed', completed_at: new Date().toISOString() })
                .eq('id', payment.order_id);

            if (orderError) throw orderError;

            // 3. Dá baixa no estoque
            if (items && items.length > 0 && user) {
                for (const item of items) {
                    if (!item.product_id) continue;

                    // Pega o estoque atual
                    const { data: prod } = await supabaseDb
                        .from('products')
                        .select('current_stock')
                        .eq('id', item.product_id)
                        .single();

                    if (prod && prod.current_stock !== null) {
                        const newStock = Number(prod.current_stock) - Number(item.quantity);

                        // Atualiza produto
                        await supabaseDb
                            .from('products')
                            .update({ current_stock: newStock })
                            .eq('id', item.product_id);

                        // Registra a movimentação
                        await supabaseDb
                            .from('stock_movements')
                            .insert([{
                                product_id: item.product_id,
                                user_id: user.id,
                                type: 'exit',
                                quantity: Number(item.quantity),
                                reason: `Venda PDV - Pedido #${payment.order_id.substring(0, 8)}`,
                                reference_id: payment.order_id,
                                reference_type: 'order'
                            }]);
                    }
                }
            }

            // 4. Integração Financeira: Obtenha ou Crie Categoria de Venda
            let categoryId = null;
            if (user) {
                const { data: existingCat } = await supabaseDb
                    .from('expense_categories')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('type', 'income')
                    .ilike('name', '%Venda%')
                    .limit(1)
                    .single();

                if (existingCat) {
                    categoryId = existingCat.id;
                } else {
                    const { data: newCat } = await supabaseDb
                        .from('expense_categories')
                        .insert([{
                            user_id: user.id,
                            name: 'Vendas PDV',
                            type: 'income',
                            color: '#10b981'
                        }])
                        .select()
                        .single();
                    if (newCat) categoryId = newCat.id;
                }
            }

            // 5. Integração Financeira: Injete diretamente no Fluxo de Caixa
            if (user) {
                await supabaseDb
                    .from('cash_flow_entries')
                    .insert([{
                        user_id: user.id,
                        type: 'income',
                        amount: total_order,
                        description: `Venda PDV - #${payment.order_id.substring(0, 8)}`,
                        entry_date: new Date().toISOString().split('T')[0],
                        payment_method: payment.method,
                        category_id: categoryId,
                        reference_type: 'order',
                        reference_id: payment.order_id
                    }]);
            }

            return payData;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activeOrders'] });
            toast.success(t('toast.orderSuccess') || 'Pedido enviado com sucesso!');
        },
        onError: (error) => {
            toast.error((t('toast.orderError') || 'Erro ao enviar pedido: ') + error.message);
        }
    });

    return {
        activeOrders,
        isLoadingActive,
        createOrder,
        addOrderItem,
        processPayment
    };
};
