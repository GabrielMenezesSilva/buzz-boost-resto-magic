import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { Database } from '@/integrations/supabase/types';

export type Product = Database['public']['Tables']['products']['Row'] & {
    category: Pick<Database['public']['Tables']['categories']['Row'], 'name' | 'color'> | null;
    supplier: Pick<Database['public']['Tables']['suppliers']['Row'], 'name'> | null;
};
type ProductInsert = Database['public']['Tables']['products']['Insert'];

export function useProducts() {
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch all products with their category and supplier names included
    const { data: products, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            if (!user) return [];

            const { data, error } = await supabase
                .from('products')
                .select(`
          *,
          category:categories(name, color),
          supplier:suppliers(name)
        `)
                .eq('user_id', user.id)
                .order('name');

            if (error) throw error;
            return data as unknown as Product[];
        },
        enabled: !!user,
    });

    const addProduct = useMutation({
        mutationFn: async (newProduct: Omit<ProductInsert, 'user_id'>) => {
            if (!user) throw new Error('Não autenticado');
            const { data, error } = await supabase
                .from('products')
                .insert([{ ...newProduct, user_id: user.id }])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast({ title: 'Produto adicionado' });
        },
        onError: (error) => {
            toast({ title: 'Erro ao adicionar', description: error.message, variant: 'destructive' });
        }
    });

    const updateProduct = useMutation({
        mutationFn: async ({ id, ...updates }: Partial<ProductInsert> & { id: string }) => {
            const { data, error } = await supabase
                .from('products')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast({ title: 'Produto atualizado' });
        },
        onError: (error) => {
            toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' });
        }
    });

    const deleteProduct = useMutation({
        mutationFn: async (id: string) => {
            const { data, error } = await supabase
                .from('products')
                .delete()
                .eq('id', id)
                .select();

            if (error) throw error;
            if (!data || data.length === 0) {
                throw new Error("Produto não encontrado, está atrelado a algum pedido, ou você não tem permissão para excluí-lo.");
            }
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast({ title: 'Produto removido' });
        },
        onError: (error) => {
            toast({ title: 'Erro ao remover', description: error.message, variant: 'destructive' });
        }
    });

    const addStock = useMutation({
        mutationFn: async ({ id, amount, reason, batch, expiryDate }: { id: string, amount: number, reason?: string, batch?: string, expiryDate?: string }) => {
            if (!user) throw new Error('Não autenticado');

            // 1. Get current
            const { data: prod, error: fetchErr } = await supabase
                .from('products')
                .select('current_stock')
                .eq('id', id)
                .single();
            if (fetchErr) throw fetchErr;

            const newStock = Number(prod?.current_stock || 0) + Number(amount);

            // 2. Update stock & expiry/batch if provided
            const updatePayload: any = { current_stock: newStock };
            if (expiryDate) updatePayload.expiry_date = expiryDate;
            if (batch) updatePayload.sku = batch; // Saving batch in SKU column for now

            const { error: updateErr } = await supabase
                .from('products')
                .update(updatePayload)
                .eq('id', id);
            if (updateErr) throw updateErr;

            // 3. Log movement
            let finalReason = reason || 'Entrada manual de estoque';
            if (batch) finalReason += ` (Lote: ${batch})`;

            await supabase.from('stock_movements').insert([{
                product_id: id,
                user_id: user.id,
                type: 'entry',
                quantity: Number(amount),
                reason: finalReason
            }]);

            return { id, newStock };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['inventoryAlerts'] });
            toast({ title: 'Estoque atualizado com sucesso' });
        },
        onError: (error) => {
            toast({ title: 'Erro ao atualizar estoque', description: error.message, variant: 'destructive' });
        }
    });

    return {
        products: products || [],
        isLoading,
        addProduct,
        updateProduct,
        deleteProduct,
        addStock
    };
}
