import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export type ExpenseCategory = {
    id: string;
    user_id: string;
    name: string;
    type: 'income' | 'expense';
    color: string | null;
    is_system: boolean | null;
    created_at: string | null;
    updated_at: string | null;
};

export type ExpenseCategoryInsert = Omit<ExpenseCategory, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'is_system'>;

export function useExpenseCategories() {
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: categories, isLoading, error } = useQuery({
        queryKey: ['expense_categories'],
        queryFn: async () => {
            if (!user) return [];

            const { data, error } = await supabase
                .from('expense_categories' as any)
                .select('*')
                .eq('user_id', user.id)
                .order('name');

            if (error) throw error;
            return data as unknown as ExpenseCategory[];
        },
        enabled: !!user,
        retry: false,
    });

    const addCategory = useMutation({
        mutationFn: async (newCategory: ExpenseCategoryInsert) => {
            if (!user) throw new Error('Não autenticado');

            const { data, error } = await supabase
                .from('expense_categories' as any)
                .insert([{ ...newCategory, user_id: user.id }])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expense_categories'] });
            toast({ title: 'Categoria adicionada' });
        },
        onError: (error) => {
            toast({ title: 'Erro ao adicionar', description: error.message, variant: 'destructive' });
        }
    });

    const updateCategory = useMutation({
        mutationFn: async ({ id, ...updates }: Partial<ExpenseCategoryInsert> & { id: string }) => {
            const { data, error } = await supabase
                .from('expense_categories' as any)
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expense_categories'] });
            toast({ title: 'Categoria atualizada' });
        },
        onError: (error) => {
            toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' });
        }
    });

    const deleteCategory = useMutation({
        mutationFn: async (id: string) => {
            const { data, error } = await supabase
                .from('expense_categories' as any)
                .delete()
                .eq('id', id)
                .select();

            if (error) throw error;
            if (!data || data.length === 0) {
                throw new Error("Não foi possível excluir.");
            }
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expense_categories'] });
            toast({ title: 'Categoria removida' });
        },
        onError: (error) => {
            toast({ title: 'Erro ao remover', description: error.message, variant: 'destructive' });
        }
    });

    return {
        categories: categories || [],
        isLoading,
        error,
        addCategory,
        updateCategory,
        deleteCategory
    };
}
