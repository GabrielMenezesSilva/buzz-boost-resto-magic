import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import { format } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, ReceiptText, Calendar } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

export default function Orders() {
    const { user } = useAuth();
    const { t, language } = useLanguage();
    const [searchTerm, setSearchTerm] = useState("");
    const [daysFilter, setDaysFilter] = useState<number | null>(7);
    const [selectedOrder, setSelectedOrder] = useState<Record<string, unknown> | null>(null);
    const dateLocale = language === 'pt' ? ptBR : enUS;

    // Fetch Completed Orders
    const { data: orders = [], isLoading } = useQuery({
        queryKey: ['orderHistory', user?.id, daysFilter],
        queryFn: async () => {
            if (!user) return [];
            let query = supabase
                .from('orders')
                .select(`
                    *,
                    pos_sessions(employee_id),
                    table:restaurant_tables(name),
                    order_items(*),
                    payments(*)
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (daysFilter) {
                const date = new Date();
                date.setDate(date.getDate() - daysFilter);
                query = query.gte('created_at', date.toISOString());
            }

            const { data, error } = await query;

            if (error) throw error;
            return data;
        },
        enabled: !!user,
    });

    const filteredOrders = orders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.table?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
            case 'cancelled': return 'bg-red-500/10 text-red-600 border-red-200';
            default: return 'bg-blue-500/10 text-blue-600 border-blue-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed': return t('orders.statusCompleted');
            case 'cancelled': return t('orders.statusCancelled');
            case 'open': return t('orders.statusOpen');
            default: return status;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-light/20 to-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('orders.title')}</h1>
                    <p className="text-muted-foreground mt-1">{t('orders.subtitle')}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder={t('orders.searchPlaceholder')}
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button
                        variant={daysFilter === 7 ? "default" : "outline"}
                        className="w-full sm:w-auto"
                        onClick={() => setDaysFilter(daysFilter === 7 ? null : 7)}
                    >
                        <Calendar className="w-4 h-4 mr-2" />
                        {t('orders.last7days')}
                    </Button>
                </div>

                <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                    {isLoading ? (
                        <div className="p-8 text-center text-muted-foreground">{t('orders.loading')}</div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                            <ReceiptText className="w-12 h-12 mb-4 opacity-20" />
                            <p>{t('orders.empty')}</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>{t('orders.colDateTime')}</TableHead>
                                    <TableHead>{t('orders.colTable')}</TableHead>
                                    <TableHead>{t('orders.colItems')}</TableHead>
                                    <TableHead>{t('orders.colTotal')}</TableHead>
                                    <TableHead>{t('orders.colStatus')}</TableHead>
                                    <TableHead className="text-right">{t('orders.colAction')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.map((order) => (
                                    <TableRow key={order.id} className="hover:bg-muted/30">
                                        <TableCell className="font-medium">
                                            {format(new Date(order.created_at), `dd/MM '${t('orders.at')}' HH:mm`, { locale: dateLocale })}
                                            <p className="text-[10px] text-muted-foreground mt-0.5">#{order.id.substring(0, 8)}</p>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-semibold">{order.table?.name || t('orders.counterRef')}</span>
                                        </TableCell>
                                        <TableCell>{order.order_items?.length || 0} {t('orders.itemsAbbrev')}</TableCell>
                                        <TableCell className="font-bold text-primary">
                                            {t('orders.currency')} {Number(order.total || 0).toFixed(2).replace('.', ',')}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getStatusColor(order.status)}>
                                                {getStatusText(order.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                                                <FileText className="w-4 h-4 mr-2" />
                                                {t('orders.receiptBtn')}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>

            <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-center font-black text-xl mb-4">{t('orders.digitalReceiptTitle')}</DialogTitle>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="font-mono text-sm space-y-4">
                            <div className="text-center border-b pb-4 border-dashed">
                                <p className="font-bold text-base">{t('orders.dopplerDine')}</p>
                                <p className="text-xs text-muted-foreground mt-1">{t('orders.orderHash')}{selectedOrder.id.substring(0, 8).toUpperCase()}</p>
                                <p className="text-xs text-muted-foreground">{format(new Date(selectedOrder.created_at), "dd/MM/yyyy HH:mm:ss", { locale: dateLocale })}</p>
                                <p className="font-bold mt-2">{t('orders.tableRef')} {selectedOrder.table?.name || t('orders.counter')}</p>
                            </div>

                            <div className="space-y-2 pb-4 border-b border-dashed">
                                <div className="flex justify-between font-bold text-xs mb-1">
                                    <span>{t('orders.qtdItem')}</span>
                                    <span>{t('orders.currency')}</span>
                                </div>
                                {(selectedOrder.order_items as Array<Record<string, unknown>>)?.map((item: Record<string, unknown>) => (
                                    <div key={item.id as string} className="flex justify-between">
                                        <span>{item.quantity}x {item.product_name}</span>
                                        <span>{Number(item.subtotal || 0).toFixed(2).replace('.', ',')}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-1 pb-4 border-b border-dashed font-bold">
                                <div className="flex justify-between">
                                    <span>{t('orders.receiptSubtotal')}</span>
                                    <span>{Number(selectedOrder.subtotal || 0).toFixed(2).replace('.', ',')}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>{t('orders.receiptDiscount')}</span>
                                    <span>- {Number(selectedOrder.discount_amount || 0).toFixed(2).replace('.', ',')}</span>
                                </div>
                                <div className="flex justify-between text-base mt-2 pt-2 border-t">
                                    <span>{t('orders.receiptTotal')}</span>
                                    <span>{t('orders.currency')} {Number(selectedOrder.total || 0).toFixed(2).replace('.', ',')}</span>
                                </div>
                            </div>

                            {selectedOrder.payments?.[0] && (
                                <div className="text-xs">
                                    <p>{t('orders.paymentVia')} {selectedOrder.payments[0].method.toUpperCase()}</p>
                                </div>
                            )}

                            <div className="pt-4 flex justify-center w-full">
                                <Button className="w-full" onClick={() => window.print()}>{t('orders.printReceipt')}</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
