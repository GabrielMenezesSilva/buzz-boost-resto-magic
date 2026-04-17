import { useEffect, useState, useCallback } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { OrderWithItems } from '@/types/pos';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChefHat, Clock, UtensilsCrossed, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

// ── Status config ──────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  open: {
    label: 'kitchen.statusOpen',
    color: 'bg-amber-500/15 border-amber-500/40 text-amber-400',
    dot: 'bg-amber-400',
  },
  preparing: {
    label: 'kitchen.statusPreparing',
    color: 'bg-orange-500/15 border-orange-500/40 text-orange-400',
    dot: 'bg-orange-400 animate-pulse',
  },
  ready: {
    label: 'kitchen.statusReady',
    color: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
    dot: 'bg-emerald-400',
  },
} as const;

type KitchenStatus = keyof typeof STATUS_CONFIG;

// ── Elapsed timer ──────────────────────────────────────────────────────────────
function ElapsedTime({ createdAt }: { createdAt: string }) {
  const [label, setLabel] = useState('');

  useEffect(() => {
    const update = () =>
      setLabel(
        formatDistanceToNow(new Date(createdAt), { addSuffix: false, locale: fr }),
      );
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, [createdAt]);

  return <span>{label}</span>;
}

// ── Order card ─────────────────────────────────────────────────────────────────
interface OrderCardProps {
  order: OrderWithItems;
  onSetPreparing: (id: string) => void;
  onSetReady: (id: string) => void;
  isPending: boolean;
}

function OrderCard({ order, onSetPreparing, onSetReady, isPending }: OrderCardProps) {
  const { t } = useLanguage();
  const status = (order.status ?? 'open') as KitchenStatus;
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.open;

  return (
    <div
      className={`rounded-2xl border p-5 flex flex-col gap-4 transition-all duration-300 ${cfg.color}`}
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
            {t('kitchen.order')} #{order.order_number ?? '—'}
          </p>
          <p className="text-lg font-bold leading-tight">
            {t('kitchen.table')}:{' '}
            {(order as OrderWithItems & { restaurant_tables?: { name: string } })
              .restaurant_tables?.name ?? '—'}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
          <Badge variant="outline" className="text-xs border-current">
            {t(cfg.label)}
          </Badge>
        </div>
      </div>

      {/* Items list */}
      <ul className="space-y-1.5">
        {order.order_items?.map((item) => (
          <li key={item.id} className="flex justify-between text-sm">
            <span className="font-medium">
              {item.quantity}× {item.product_name}
            </span>
            {item.notes && (
              <span className="text-xs opacity-60 italic truncate max-w-[120px]">
                {item.notes}
              </span>
            )}
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-current/20">
        <div className="flex items-center gap-1.5 text-xs opacity-60">
          <Clock className="w-3 h-3" />
          <ElapsedTime createdAt={order.created_at} />
        </div>

        <div className="flex gap-2">
          {status === 'open' && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs border-orange-400/60 text-orange-400 hover:bg-orange-500/20"
              disabled={isPending}
              onClick={() => onSetPreparing(order.id)}
            >
              <ChefHat className="w-3 h-3 mr-1.5" />
              {t('kitchen.markPreparing')}
            </Button>
          )}
          {(status === 'open' || status === 'preparing') && (
            <Button
              size="sm"
              className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={isPending}
              onClick={() => onSetReady(order.id)}
            >
              <CheckCircle2 className="w-3 h-3 mr-1.5" />
              {t('kitchen.markReady')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function Kitchen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  // Realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('kitchen-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`,
        },
        () => queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] }),
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, queryClient]);

  // Query: open + preparing orders only
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['kitchenOrders', user?.id],
    queryFn: async (): Promise<OrderWithItems[]> => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*), payments(*), restaurant_tables(name)')
        .eq('user_id', user.id)
        .in('status', ['open', 'preparing'])
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data ?? []) as OrderWithItems[];
    },
    enabled: !!user,
    refetchInterval: 60_000, // safety net every 60s
  });

  // Mutation: update order status
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .eq('user_id', user!.id);
      if (error) throw error;
    },
    onSuccess: (_data, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] });
      queryClient.invalidateQueries({ queryKey: ['activeOrders'] });
      if (status === 'ready') {
        toast.success(t('kitchen.statusReady'));
      }
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : String(err));
    },
  });

  const handleSetPreparing = useCallback(
    (id: string) => updateStatus.mutate({ id, status: 'preparing' }),
    [updateStatus],
  );

  const handleSetReady = useCallback(
    (id: string) => updateStatus.mutate({ id, status: 'ready' }),
    [updateStatus],
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <UtensilsCrossed className="w-8 h-8 text-primary" />
              {t('kitchen.title')}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {t('kitchen.subtitle')}
            </p>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-2 text-sm text-emerald-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Realtime
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-52 rounded-2xl bg-muted/30 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
            <CheckCircle2 className="w-16 h-16 opacity-30" />
            <p className="text-lg font-medium">{t('kitchen.noOrders')}</p>
            <p className="text-sm">{t('kitchen.noOrdersDesc')}</p>
          </div>
        )}

        {/* Orders grid */}
        {!isLoading && orders.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onSetPreparing={handleSetPreparing}
                onSetReady={handleSetReady}
                isPending={updateStatus.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
