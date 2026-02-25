import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
const supabaseDb = supabase as any;
import { useAuth } from '@/hooks/useAuth';
import { RestaurantTable } from '@/types/pos';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export const useTables = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { t } = useLanguage();

    const getTables = async (): Promise<RestaurantTable[]> => {
        if (!user) return [];

        const { data, error } = await supabaseDb
            .from('restaurant_tables')
            .select('*')
            .order('sort_order', { ascending: true })
            .order('name', { ascending: true });

        if (error) throw error;
        return data as RestaurantTable[];
    };

    const { data: tables = [], isLoading, error } = useQuery({
        queryKey: ['tables', user?.id],
        queryFn: getTables,
        enabled: !!user,
    });

    const generateDefaultTables = useMutation({
        mutationFn: async (count: number) => {
            if (!user) throw new Error('Not authenticated');

            const newTables = Array.from({ length: count }).map((_, i) => ({
                user_id: user.id,
                name: `Table ${i + 1}`,
                capacity: 4,
                sort_order: i,
                status: 'available' as const,
            }));

            const { data, error } = await supabaseDb
                .from('restaurant_tables')
                .insert(newTables)
                .select();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tables'] });
            toast.success('Default tables generated successfully');
        },
        onError: (error) => {
            toast.error('Failed to generate tables: ' + error.message);
        }
    });

    const addTable = useMutation({
        mutationFn: async (tableInfo: Partial<RestaurantTable>) => {
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabaseDb
                .from('restaurant_tables')
                .insert([{
                    ...tableInfo,
                    user_id: user.id,
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tables'] });
            toast.success('Table added successfully');
        },
        onError: (error) => {
            toast.error('Failed to add table: ' + error.message);
        }
    });

    const updateTable = useMutation({
        mutationFn: async (table: Partial<RestaurantTable> & { id: string }) => {
            const { id, ...updates } = table;
            const { data, error } = await supabaseDb
                .from('restaurant_tables')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tables'] });
            toast.success('Table updated successfully');
        },
        onError: (error) => {
            toast.error('Failed to update table: ' + error.message);
        }
    });

    const deleteTable = useMutation({
        mutationFn: async (id: string) => {
            const { data, error } = await supabaseDb
                .from('restaurant_tables')
                .delete()
                .eq('id', id)
                .select();

            if (error) throw error;
            if (!data || data.length === 0) {
                // Table doesn't exist or RLS prevented deletion
                throw new Error("Mesa não encontrada ou você não tem permissão para excluí-la.");
            }
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tables'] });
            toast.success('Table deleted successfully');
        },
        onError: (error) => {
            toast.error('Failed to delete table: ' + error.message);
        }
    });

    return {
        tables,
        isLoading,
        error,
        generateDefaultTables,
        addTable,
        updateTable,
        deleteTable
    };
};
