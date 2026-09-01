import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { RestaurantTable } from '@/types/pos';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export const useTables = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { t } = useLanguage();

    // Realtime — atualiza mesas automaticamente (ocupação, status)
    useEffect(() => {
        if (!user) return;

        const channel = supabase
            .channel('tables-realtime')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'restaurant_tables',
                filter: `user_id=eq.${user.id}`
            }, () => {
                queryClient.invalidateQueries({ queryKey: ['tables'] });
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [user, queryClient]);

    const getTables = async (): Promise<RestaurantTable[]> => {
        if (!user) return [];

        const { data, error } = await supabase
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

            const { data, error } = await supabase
                .from('restaurant_tables')
                .insert(newTables)
                .select();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tables'] });
            toast.success(t('toast.tableGenerated'));
        },
        onError: (error) => {
            toast.error(t('toast.tableGenError') + error.message);
        }
    });

    const addTable = useMutation({
        mutationFn: async (tableInfo: Partial<RestaurantTable> & { name: string }) => {
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
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
            toast.success(t('toast.tableAdded'));
        },
        onError: (error) => {
            toast.error(t('toast.tableAddError') + error.message);
        }
    });

    const updateTable = useMutation({
        mutationFn: async (table: Partial<RestaurantTable> & { id: string }) => {
            const { id, ...updates } = table;
            const { data, error } = await supabase
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
            toast.success(t('toast.tableUpdated'));
        },
        onError: (error) => {
            toast.error(t('toast.tableUpdError') + error.message);
        }
    });

    const deleteTable = useMutation({
        mutationFn: async (id: string) => {
            const { data, error } = await supabase
                .from('restaurant_tables')
                .delete()
                .eq('id', id)
                .select();

            if (error) throw error;
            if (!data || data.length === 0) {
                throw new Error("Mesa não encontrada ou você não tem permissão para excluí-la.");
            }
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tables'] });
            toast.success(t('toast.tableDeleted'));
        },
        onError: (error) => {
            toast.error(t('toast.tableDelError') + error.message);
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
