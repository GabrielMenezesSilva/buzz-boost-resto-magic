import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { Database } from '@/integrations/supabase/types';

type Category = Database['public']['Tables']['categories']['Row'];
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];

export function useCategories() {
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: categories, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            if (!user) return [];
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('user_id', user.id)
                .order('sort_order', { ascending: true });

            if (error) throw error;
            return data as Category[];
        },
        enabled: !!user,
    });

    const addCategory = useMutation({
        mutationFn: async (newCategory: Omit<CategoryInsert, 'user_id'>) => {
            if (!user) throw new Error('Usuario não logado');
            const { data, error } = await supabase
                .from('categories')
                .insert([{ ...newCategory, user_id: user.id }])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast({ title: 'Categoria criada com sucesso' });
        },
        onError: (error) => {
            toast({ title: 'Erro ao criar categoria', description: error.message, variant: 'destructive' });
        }
    });

    const updateCategory = useMutation({
        mutationFn: async ({ id, ...updates }: Partial<Category> & { id: string }) => {
            const { data, error } = await supabase
                .from('categories')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast({ title: 'Categoria atualizada' });
        },
        onError: (error) => {
            toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' });
        }
    });

    const deleteCategory = useMutation({
        mutationFn: async (id: string) => {
            const { data, error } = await supabase
                .from('categories')
                .delete()
                .eq('id', id)
                .select();

            if (error) throw error;
            if (!data || data.length === 0) {
                throw new Error("Categoria não encontrada, em uso, ou você não tem permissão para excluí-la.");
            }
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast({ title: 'Categoria removida' });
        },
        onError: (error) => {
            toast({ title: 'Erro ao remover', description: error.message, variant: 'destructive' });
        }
    });

    return {
        categories: categories || [],
        isLoading,
        addCategory,
        updateCategory,
        deleteCategory
    };
}
