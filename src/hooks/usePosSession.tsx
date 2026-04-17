import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { PosSession } from '@/types/pos';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export const usePosSession = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { t } = useLanguage();

    const getActiveSession = async (): Promise<PosSession | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('pos_sessions')
            .select('*')
            .eq('status', 'open')
            .order('opened_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) throw error;
        return data as PosSession | null;
    };

    const { data: session = null, isLoading, error } = useQuery({
        queryKey: ['activePosSession', user?.id],
        queryFn: getActiveSession,
        enabled: !!user,
    });

    const openSession = useMutation({
        mutationFn: async (openingBalance: number) => {
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('pos_sessions')
                .insert([{
                    user_id: user.id,
                    opening_balance: openingBalance,
                    status: 'open',
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activePosSession'] });
            toast.success(t('pos.sessionOpened') || 'Caixa aberto com sucesso');
        },
        onError: (error) => {
            toast.error((t('pos.sessionOpenError') || 'Erro ao abrir caixa: ') + error.message);
        }
    });

    const closeSession = useMutation({
        mutationFn: async ({ id, closingBalance }: { id: string; closingBalance: number }) => {
            if (!user) throw new Error('Not authenticated');

            // 1. Buscar todos os pagamentos das ordens desta sessão
            const { data: sessionOrders } = await supabase
                .from('orders')
                .select('id, total, payments(method, amount)')
                .eq('session_id', id)
                .eq('status', 'completed');

            // 2. Agregar totais por método de pagamento
            let total_cash = 0;
            let total_card = 0;
            let total_pix = 0;
            let total_sales = 0;
            const total_orders = sessionOrders?.length ?? 0;

            if (sessionOrders) {
                for (const order of sessionOrders) {
                    total_sales += Number(order.total ?? 0);
                    const payments = (order as { payments: { method: string; amount: number }[] }).payments ?? [];
                    for (const p of payments) {
                        const amount = Number(p.amount ?? 0);
                        if (p.method === 'cash') total_cash += amount;
                        else if (p.method === 'credit' || p.method === 'debit') total_card += amount;
                        else if (p.method === 'pix') total_pix += amount;
                    }
                }
            }

            // 3. Fechar sessão com totais agregados
            const { data, error } = await supabase
                .from('pos_sessions')
                .update({
                    status: 'closed',
                    closing_balance: closingBalance,
                    closed_at: new Date().toISOString(),
                    total_sales,
                    total_cash,
                    total_card,
                    total_pix,
                    total_orders,
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['activePosSession'] });
            const s = data as {
                total_sales: number; total_cash: number;
                total_card: number; total_pix: number; total_orders: number;
            };
            toast.success(
                `${t('pos.sessionClosed')} · ${s.total_orders} cmd · CHF ${Number(s.total_sales).toFixed(2)}`
            );
        },
        onError: (error) => {
            toast.error((t('pos.sessionCloseError') || 'Erreur à la fermeture : ') + error.message);
        }
    });

    return {
        session,
        isLoading,
        error,
        openSession,
        closeSession
    };
};
