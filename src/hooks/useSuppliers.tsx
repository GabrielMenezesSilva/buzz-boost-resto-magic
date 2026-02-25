import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { Database } from '@/integrations/supabase/types';

type Supplier = Database['public']['Tables']['suppliers']['Row'];
type SupplierInsert = Database['public']['Tables']['suppliers']['Insert'];

export function useSuppliers() {
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: suppliers, isLoading } = useQuery({
        queryKey: ['suppliers'],
        queryFn: async () => {
            if (!user) return [];
            const { data, error } = await supabase
                .from('suppliers')
                .select('*')
                .eq('user_id', user.id)
                .order('name');

            if (error) throw error;
            return data as Supplier[];
        },
        enabled: !!user,
    });

    const addSupplier = useMutation({
        mutationFn: async (newSupplier: Omit<SupplierInsert, 'user_id'>) => {
            if (!user) throw new Error('Usuario logado requerido');
            const { data, error } = await supabase
                .from('suppliers')
                .insert([{ ...newSupplier, user_id: user.id }])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            toast({ title: 'Fornecedor cadastrado' });
        },
        onError: (error) => {
            toast({ title: 'Erro ao cadastrar fornecedor', description: error.message, variant: 'destructive' });
        }
    });

    const updateSupplier = useMutation({
        mutationFn: async ({ id, ...updates }: Partial<Supplier> & { id: string }) => {
            const { data, error } = await supabase
                .from('suppliers')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            toast({ title: 'Fornecedor atualizado' });
        },
        onError: (error) => {
            toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' });
        }
    });

    const deleteSupplier = useMutation({
        mutationFn: async (id: string) => {
            const { data, error } = await supabase
                .from('suppliers')
                .delete()
                .eq('id', id)
                .select();

            if (error) throw error;
            if (!data || data.length === 0) {
                throw new Error("Fornecedor não encontrado, em uso por algum produto/movimentação, ou você não tem permissão para excluí-lo.");
            }
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            toast({ title: 'Fornecedor removido' });
        },
        onError: (error) => {
            toast({ title: 'Erro ao remover', description: error.message, variant: 'destructive' });
        }
    });

    return {
        suppliers: suppliers || [],
        isLoading,
        addSupplier,
        updateSupplier,
        deleteSupplier
    };
}
