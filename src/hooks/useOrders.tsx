import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Order, OrderItem, Payment, OrderWithItems } from '@/types/pos';
import { CartItem } from '@/hooks/useCart';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export const useOrders = (sessionId?: string) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { t } = useLanguage();

    // Realtime — atualiza ordens automaticamente quando há mudanças no DB
    useEffect(() => {
        if (!user) return;

        const channel = supabase
            .channel('orders-realtime')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'orders',
                filter: `user_id=eq.${user.id}`
            }, () => {
                queryClient.invalidateQueries({ queryKey: ['activeOrders'] });
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [user, queryClient]);

    // Buscar todos os pedidos abertos/em andamento
    const getActiveOrders = async (): Promise<OrderWithItems[]> => {
        if (!user) return [];

        let query = supabase
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
        return (data ?? []) as OrderWithItems[];
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

            const { data, error } = await supabase
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
            const { data, error } = await supabase
                .from('order_items')
                .insert([item])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activeOrders'] });
        }
    });

    // Finalizar e Pagar Pedido
    const processPayment = useMutation({
        mutationFn: async (paymentData: Omit<Payment, 'id' | 'created_at'> & { total_order: number }) => {
            const { total_order, ...payment } = paymentData;

            // 0. Fetch items to deduct stock
            const { data: items } = await supabase
                .from('order_items')
                .select('product_id, quantity, product_name')
                .eq('order_id', payment.order_id);

            // 1. Registra pagamento
            const { data: payData, error: payError } = await supabase
                .from('payments')
                .insert([payment])
                .select()
                .single();

            if (payError) throw payError;

            // 2. Fecha o Pedido
            const { error: orderError } = await supabase
                .from('orders')
                .update({ status: 'completed', completed_at: new Date().toISOString() })
                .eq('id', payment.order_id);

            if (orderError) throw orderError;

            // 3. Dá baixa no estoque (FEFO: deduz lotes por validade + actualiza current_stock)
            if (items && items.length > 0 && user) {
                for (const item of items) {
                    if (!item.product_id) continue;

                    const qty = Number(item.quantity);

                    // FEFO: deduz dos lotes com menor expiry_date primeiro
                    await supabase.rpc('deduct_stock_fefo', {
                        p_product_id: item.product_id,
                        p_user_id: user.id,
                        p_quantity: qty,
                    });

                    // Actualiza current_stock em products (contador para alertas/UI)
                    const { data: prod } = await supabase
                        .from('products')
                        .select('current_stock')
                        .eq('id', item.product_id)
                        .single();

                    if (prod && prod.current_stock !== null) {
                        await supabase
                            .from('products')
                            .update({ current_stock: Math.max(0, Number(prod.current_stock) - qty) })
                            .eq('id', item.product_id);
                    }

                    await supabase
                        .from('stock_movements')
                        .insert([{
                            product_id: item.product_id,
                            user_id: user.id,
                            type: 'exit',
                            quantity: qty,
                            reason: `Venda PDV - Pedido #${payment.order_id.substring(0, 8)}`,
                            reference_id: payment.order_id,
                            reference_type: 'order'
                        }]);
                }
            }

            // 4. Obtém ou cria categoria de venda
            let categoryId: string | null = null;
            if (user) {
                const { data: existingCat } = await supabase
                    .from('expense_categories')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('type', 'income')
                    .ilike('name', '%Venda%')
                    .limit(1)
                    .maybeSingle();

                if (existingCat) {
                    categoryId = existingCat.id;
                } else {
                    const { data: newCat } = await supabase
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

            // 5. Injeta no Fluxo de Caixa
            if (user) {
                await supabase
                    .from('cash_flow_entries')
                    .insert([{
                        user_id: user.id,
                        type: 'income',
                        amount: total_order,
                        description: `Venda PDV`,
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

    // Process Checkout Completo
    const processCheckout = useMutation({
        mutationFn: async (vars: {
            cartItems: CartItem[];
            total: number;
            method: 'cash' | 'credit' | 'debit' | 'pix' | 'none';
            table_id?: string;
        }) => {
            if (!user) throw new Error('Not authenticated');

            let orderId: string;
            let orderToReturn: Order;

            if (vars.method === 'none' && vars.table_id) {
                const { data: existingOrder } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('table_id', vars.table_id)
                    .eq('status', 'open')
                    .maybeSingle();

                if (existingOrder) {
                    orderId = existingOrder.id;
                    orderToReturn = existingOrder as Order;
                    await supabase
                        .from('orders')
                        .update({
                            total: Number(existingOrder.total || 0) + vars.total,
                            subtotal: Number(existingOrder.subtotal || 0) + vars.total
                        })
                        .eq('id', orderId);
                } else {
                    const { data: order, error: orderErr } = await supabase
                        .from('orders')
                        .insert([{
                            user_id: user.id,
                            status: 'open',
                            order_type: 'dine_in',
                            total: vars.total,
                            subtotal: vars.total,
                            table_id: vars.table_id,
                            completed_at: null
                        }])
                        .select()
                        .single();

                    if (orderErr) throw orderErr;
                    orderId = order.id;
                    orderToReturn = order as Order;
                }
            } else {
                const { data: order, error: orderErr } = await supabase
                    .from('orders')
                    .insert([{
                        user_id: user.id,
                        status: vars.method === 'none' ? 'open' : 'completed',
                        order_type: 'dine_in',
                        total: vars.total,
                        subtotal: vars.total,
                        table_id: vars.table_id ?? null,
                        completed_at: vars.method !== 'none' ? new Date().toISOString() : null
                    }])
                    .select()
                    .single();

                if (orderErr) throw orderErr;
                orderId = order.id;
                orderToReturn = order as Order;
            }

            // 2. Inserir Itens do Pedido
            const orderItems = vars.cartItems.map(c => ({
                order_id: orderId,
                product_id: c.product.id,
                product_name: c.product.name,
                unit_price: c.product.sell_price,
                quantity: c.quantity,
                subtotal: c.quantity * c.product.sell_price
            }));

            const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
            if (itemsErr) throw itemsErr;

            // 3. Se pagamento à vista: payments, stock, cash flow
            if (vars.method !== 'none') {
                await supabase.from('payments').insert([{
                    order_id: orderId,
                    method: vars.method,
                    amount: vars.total,
                    change_given: 0
                }]);

                for (const item of vars.cartItems) {
                    const qty = Number(item.quantity);

                    // FEFO: deduz lotes por data de validade
                    await supabase.rpc('deduct_stock_fefo', {
                        p_product_id: item.product.id,
                        p_user_id: user.id,
                        p_quantity: qty,
                    });

                    // Actualiza current_stock (contador para alertas/UI)
                    const { data: prod } = await supabase
                        .from('products')
                        .select('current_stock')
                        .eq('id', item.product.id)
                        .single();

                    if (prod && prod.current_stock !== null) {
                        await supabase
                            .from('products')
                            .update({ current_stock: Math.max(0, Number(prod.current_stock) - qty) })
                            .eq('id', item.product.id);
                    }

                    await supabase.from('stock_movements').insert([{
                        product_id: item.product.id,
                        user_id: user.id,
                        type: 'exit',
                        quantity: qty,
                        reason: `Venda PDV - Pedido #${orderId.substring(0, 8)}`,
                        reference_id: orderId,
                        reference_type: 'order'
                    }]);
                }

                let categoryId: string | null = null;
                const { data: existingCat } = await supabase.from('expense_categories')
                    .select('id').eq('user_id', user.id).eq('type', 'income').ilike('name', '%Venda%').limit(1).maybeSingle();

                if (existingCat) {
                    categoryId = existingCat.id;
                } else {
                    const { data: newCat } = await supabase.from('expense_categories')
                        .insert([{ user_id: user.id, name: 'Vendas PDV', type: 'income', color: '#10b981' }])
                        .select().single();
                    if (newCat) categoryId = newCat.id;
                }

                await supabase.from('cash_flow_entries').insert([{
                    user_id: user.id,
                    type: 'income',
                    amount: vars.total,
                    description: `Venda PDV - #${orderId.substring(0, 8)}`,
                    entry_date: new Date().toISOString().split('T')[0],
                    payment_method: vars.method === 'pix' ? 'pix' : (vars.method === 'credit' || vars.method === 'debit') ? 'card' : 'cash',
                    category_id: categoryId,
                    reference_type: 'order',
                    reference_id: orderId
                }]);
            }

            return orderToReturn;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activeOrders'] });
            toast.success(t('pos.orderSuccess') || 'Venda finalizada!');
        },
        onError: (error) => {
            toast.error((t('pos.orderError') || 'Erro na venda: ') + error.message);
        }
    });

    return {
        activeOrders,
        isLoadingActive,
        createOrder,
        addOrderItem,
        processPayment,
        processCheckout
    };
};
