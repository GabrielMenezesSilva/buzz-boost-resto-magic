import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { startOfMonth, endOfMonth, format, subMonths } from 'date-fns';

interface CashFlowMetric {
    amount: number;
    type: string;
    entry_date: string;
}

interface OrderMetric {
    id: string;
    total: number;
    created_at: string;
    status: string;
}

export function useReports(period: 'month' | 'last_month' | 'year' = 'month') {
    const { user } = useAuth();

    const getDates = () => {
        const now = new Date();
        if (period === 'month') {
            return {
                start: format(startOfMonth(now), 'yyyy-MM-dd'),
                end: format(endOfMonth(now), 'yyyy-MM-dd')
            };
        } else if (period === 'last_month') {
            const lastMonth = subMonths(now, 1);
            return {
                start: format(startOfMonth(lastMonth), 'yyyy-MM-dd'),
                end: format(endOfMonth(lastMonth), 'yyyy-MM-dd')
            };
        } else {
            // Year
            return {
                start: format(new Date(now.getFullYear(), 0, 1), 'yyyy-MM-dd'),
                end: format(new Date(now.getFullYear(), 11, 31), 'yyyy-MM-dd')
            };
        }
    };

    const { start, end } = getDates();

    const { data: reportData, isLoading, error } = useQuery({
        queryKey: ['reports', period],
        queryFn: async () => {
            if (!user) return null;

            // Buscamos fluxo de caixa
            let cashFlowArray: CashFlowMetric[] = [];

            const { data: cashFlow, error: cfError } = await supabase
                .from('cash_flow_entries')
                .select('amount, type, entry_date')
                .eq('user_id', user.id)
                .gte('entry_date', start)
                .lte('entry_date', end);

            if (cfError) {
                console.warn("Reports: Supabase missing, fetching from LocalStorage mock.");
                const localStr = localStorage.getItem('dd_mock_cashflow');
                if (localStr) {
                    const localData = JSON.parse(localStr);
                    cashFlowArray = localData.filter((e: CashFlowMetric) => e.entry_date >= start && e.entry_date <= end);
                }
            } else {
                cashFlowArray = cashFlow as unknown as CashFlowMetric[];
            }

            // Buscamos itens de pedidos finalizados para metrics
            // We need to join orders with order_items. 
            // supabase-js approach: fetch orders in range, then fetch order_items for those orders.
            const { data: orders, error: ordersError } = await supabase
                .from('orders')
                .select('id, total, created_at, status')
                .eq('user_id', user.id)
                .eq('status', 'completed')
                .gte('created_at', `${start}T00:00:00Z`)
                .lte('created_at', `${end}T23:59:59Z`);

            // Ignore order errors if tables don't exist, to not block cashflow viewing
            const ordersArray = ordersError ? [] : (orders as unknown as OrderMetric[]);

            let totalIncome = 0;
            let totalExpense = 0;

            cashFlowArray?.forEach(entry => {
                if (entry.type === 'income') totalIncome += Number(entry.amount);
                else totalExpense += Number(entry.amount);
            });

            // Calculate daily chart data
            const dailyDataMap = new Map<string, { income: number, expense: number }>();

            cashFlowArray?.forEach(entry => {
                const date = entry.entry_date;
                const existing = dailyDataMap.get(date) || { income: 0, expense: 0 };
                if (entry.type === 'income') {
                    existing.income += Number(entry.amount);
                } else {
                    existing.expense += Number(entry.amount);
                }
                dailyDataMap.set(date, existing);
            });

            // Convert to array and sort
            const chartData = Array.from(dailyDataMap.entries())
                .map(([date, data]) => ({ date, ...data }))
                .sort((a, b) => a.date.localeCompare(b.date));

            // Ticket Medio
            const orderCount = ordersArray?.length || 0;
            const pdvRevenue = ordersArray?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
            const avgTicket = orderCount > 0 ? pdvRevenue / orderCount : 0;

            return {
                totalIncome,
                totalExpense,
                netProfit: totalIncome - totalExpense,
                chartData,
                avgTicket,
                orderCount
            };
        },
        enabled: !!user,
        retry: false,
    });

    return {
        data: reportData,
        isLoading,
        error
    };
}
