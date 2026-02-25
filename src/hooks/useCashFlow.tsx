import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { ExpenseCategory } from './useExpenseCategories';
import { Database } from '@/integrations/supabase/types';

type CashFlowEntryRow = Database['public']['Tables']['cash_flow_entries']['Row'];

export type CashFlowEntry = {
    id: string;
    user_id: string;
    category_id: string | null;
    type: 'income' | 'expense';
    amount: number;
    description: string;
    entry_date: string;
    payment_method: string | null;
    reference_id: string | null;
    reference_type: string | null;
    is_recurring: boolean | null;
    created_at: string | null;
    updated_at: string | null;
    category?: Pick<ExpenseCategory, 'name' | 'color'> | null;
};

export type CashFlowEntryInsert = Omit<CashFlowEntry, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'category'>;

export function useCashFlow(startDate?: string, endDate?: string) {
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: entries, isLoading, error } = useQuery({
        queryKey: ['cash_flow_entries', startDate, endDate],
        queryFn: async () => {
            if (!user) return [];

            let query = supabase
                .from('cash_flow_entries')
                .select(`
                    *,
                    category:expense_categories(name, color)
                `)
                .eq('user_id', user.id)
                .order('entry_date', { ascending: false })
                .order('created_at', { ascending: false });

            if (startDate) {
                query = query.gte('entry_date', startDate);
            }
            if (endDate) {
                query = query.lte('entry_date', endDate);
            }

            const { data, error } = await query;

            if (error) throw error;
            return data as unknown as CashFlowEntry[];
        },
        enabled: !!user,
        retry: false,
    });

    const addEntry = useMutation({
        mutationFn: async (newEntry: CashFlowEntryInsert) => {
            if (!user) throw new Error('Não autenticado');

            const { data, error } = await supabase
                .from('cash_flow_entries')
                .insert([{ ...newEntry, user_id: user.id }])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cash_flow_entries'] });
            toast({ title: 'Lançamento adicionado' });
        },
        onError: (error) => {
            toast({ title: 'Erro ao adicionar', description: error.message, variant: 'destructive' });
        }
    });

    const deleteEntry = useMutation({
        mutationFn: async (id: string) => {
            const { data, error } = await supabase
                .from('cash_flow_entries')
                .delete()
                .eq('id', id)
                .select();

            if (error) throw error;
            if (!data || data.length === 0) {
                throw new Error("Lançamento não encontrado.");
            }
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cash_flow_entries'] });
            toast({ title: 'Lançamento removido' });
        },
        onError: (error) => {
            toast({ title: 'Erro ao remover', description: error.message, variant: 'destructive' });
        }
    });

    return {
        entries: entries || [],
        isLoading,
        error,
        addEntry,
        deleteEntry
    };
}
