import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
const supabaseDb = supabase as any;
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

        const { data, error } = await supabaseDb
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
            toast.success('Caixa aberto com sucesso');
        },
        onError: (error) => {
            toast.error('Erro ao abrir caixa: ' + error.message);
        }
    });

    const closeSession = useMutation({
        mutationFn: async ({ id, closingBalance }: { id: string; closingBalance: number }) => {
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('pos_sessions')
                .update({
                    status: 'closed',
                    closing_balance: closingBalance,
                    closed_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activePosSession'] });
            toast.success('Caixa fechado com sucesso');
        },
        onError: (error) => {
            toast.error('Erro ao fechar caixa: ' + error.message);
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
