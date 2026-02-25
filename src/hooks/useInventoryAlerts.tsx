import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Database } from '@/integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];

export function useInventoryAlerts() {
    const { user } = useAuth();

    const { data: alerts, isLoading } = useQuery({
        queryKey: ['inventory-alerts'],
        queryFn: async () => {
            if (!user) return { lowStock: [], expiring: [] };

            // 1. Fetch low stock items
            const { data: lowStockData, error: stockError } = await supabase
                .from('products')
                .select('*')
                .eq('user_id', user.id)
                .eq('active', true)
                .lte('current_stock', 'min_stock')
                .order('current_stock', { ascending: true });

            if (stockError) throw stockError;

            // 2. Fetch expiring items (next 30 days)
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

            const { data: expiringData, error: expiryError } = await supabase
                .from('products')
                .select('*')
                .eq('user_id', user.id)
                .eq('active', true)
                .not('expiry_date', 'is', null)
                .lte('expiry_date', thirtyDaysFromNow.toISOString().split('T')[0])
                .order('expiry_date', { ascending: true });

            if (expiryError) throw expiryError;

            return {
                lowStock: lowStockData as Product[],
                expiring: expiringData as Product[]
            };
        },
        enabled: !!user,
    });

    return {
        alerts: alerts || { lowStock: [], expiring: [] },
        isLoading
    };
}
