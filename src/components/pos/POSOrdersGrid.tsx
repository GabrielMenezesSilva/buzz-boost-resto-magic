import { OrderWithItems, RestaurantTable } from "@/types/pos";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/currency";
import { Clock, ShoppingBag } from "lucide-react";

interface POSOrdersGridProps {
    t: (key: string) => string;
    activeOrders: OrderWithItems[];
    tables: RestaurantTable[];
    handleSelectOrder: (order: OrderWithItems) => void;
}

export function POSOrdersGrid({ t, activeOrders, tables, handleSelectOrder }: POSOrdersGridProps) {
    if (activeOrders.length === 0) {
        return (
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-muted-foreground w-full h-full">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="h-8 w-8 text-muted-foreground opacity-50" />
                </div>
                <p className="text-lg">{t('pos.noActiveOrders') || 'Nenhum pedido em andamento'}</p>
            </div>
        );
    }

    const getTableName = (tableId?: string) => {
        if (!tableId) return 'Balcão / Viagem';
        const table = tables.find(t => t.id === tableId);
        return table ? table.name : `Mesa (ID: ${tableId.substring(0, 4)})`;
    };

    return (
        <div className="flex-1 p-6 overflow-auto w-full">
            <h2 className="text-lg font-bold mb-4">{t('pos.activeOrders') || 'Pedidos em Andamento'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {activeOrders.map(order => (
                    <div
                        key={order.id}
                        onClick={() => handleSelectOrder(order)}
                        className="bg-card border rounded-xl p-4 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all flex flex-col"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <p className="font-bold text-lg">
                                    {getTableName(order.table_id)}
                                </p>
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200">
                                {order.status === 'open' ? (t('pos.orderOpen') || 'Aberto') : order.status}
                            </Badge>
                        </div>

                        <div className="space-y-1 mb-4 flex-1">
                            {order.order_items?.slice(0, 3).map((item, i: number) => (
                                <div key={item.id ?? i} className="flex justify-between text-sm">
                                    <span className="truncate pr-2">{item.quantity}x {item.product_name}</span>
                                    <span className="text-muted-foreground">{formatCurrency(item.subtotal)}</span>
                                </div>
                            ))}
                            {(order.order_items?.length || 0) > 3 && (
                                <p className="text-xs text-muted-foreground italic mt-2">
                                    + {(order.order_items?.length || 0) - 3} {t('pos.moreItems') || 'itens'}
                                </p>
                            )}
                        </div>

                        <div className="pt-3 border-t flex justify-between items-center mt-auto">
                            <span className="font-medium text-sm text-muted-foreground">Total</span>
                            <span className="font-bold text-lg text-primary">{formatCurrency(order.total)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
