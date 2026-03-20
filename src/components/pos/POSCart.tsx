import { ShoppingCart, Coffee, Trash2, Minus, Plus, Banknote, CreditCard, QrCode, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/utils/currency";
interface POSCartProps {
    readonly t: (key: string) => string;
    readonly cartItems: ReadonlyArray<{ readonly product: { readonly id: string; readonly name: string; readonly sell_price: number }; readonly quantity: number }>;
    readonly cartTotal: number;
    readonly cartItemCount: number;
    readonly selectedTable: string | null;
    readonly setSelectedTable: (id: string | null) => void;
    readonly tables: ReadonlyArray<{ readonly id: string; readonly name: string }>;
    readonly updateQuantity: (id: string, quantity: number) => void;
    readonly removeItem: (id: string) => void;
    readonly clearCart: () => void;
    readonly processCheckout: { readonly isPending: boolean };
    readonly handleCheckout: (method: 'cash' | 'credit' | 'pix' | 'none') => void;
    readonly effectiveRole: string;
}

export function POSCart({
    t,
    cartItems,
    cartTotal,
    cartItemCount,
    selectedTable,
    setSelectedTable,
    tables,
    updateQuantity,
    removeItem,
    clearCart,
    processCheckout,
    handleCheckout,
    effectiveRole
}: POSCartProps) {
    return (
        <div className="w-[380px] flex flex-col bg-background border-l shrink-0 shadow-[-4px_0_24px_-12px_rgba(0,0,0,0.1)] z-20">
            <div className="p-4 border-b flex flex-col space-y-3 bg-muted/20">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-lg flex items-center">
                        <ShoppingCart className="w-5 h-5 mr-2 text-primary" />
                        {t('pos.currentOrder')}
                    </h2>
                    {cartItemCount > 0 && (
                        <Badge className="bg-primary hover:bg-primary font-bold">
                            {cartItemCount} {t('pos.items')}
                        </Badge>
                    )}
                </div>

                <div className={`p-2.5 rounded-lg border ${selectedTable ? 'bg-primary/5 border-primary/20' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                    {selectedTable ? (
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-sm flex items-center">
                                <Coffee className="w-4 h-4 mr-1.5" />
                                {tables.find(t => t.id === selectedTable)?.name}
                            </span>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setSelectedTable(null)}>
                                {t('pos.change')}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center text-sm font-medium">
                            ⚠️ {t('pos.selectTable')}
                        </div>
                    )}
                </div>
            </div>

            <ScrollArea className="flex-1 bg-background">
                {cartItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground opacity-60 mt-20">
                        <ShoppingCart className="w-16 h-16 mb-4 opacity-50" />
                        <p className="font-medium text-lg">{t('pos.emptyCart')}</p>
                        <p className="text-sm mt-2">{t('pos.emptyCartDesc')}</p>
                    </div>
                ) : (
                    <div className="p-2 space-y-1">
                        {cartItems.map((item) => (
                            <div key={item.product.id} className="group flex items-center p-2 hover:bg-muted/50 rounded-lg transition-colors">
                                <div className="flex-1 min-w-0 pr-2">
                                    <p className="font-semibold text-sm truncate">{item.product.name}</p>
                                    <p className="text-xs text-muted-foreground font-medium mt-0.5">{formatCurrency(item.product.sell_price)} {t('pos.un')}</p>
                                </div>
                                <div className="flex flex-col items-end shrink-0">
                                    <p className="font-bold text-sm mb-2">{formatCurrency(item.product.sell_price * item.quantity)}</p>
                                    <div className="flex items-center bg-background border rounded-md shadow-sm">
                                        <button
                                            className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground rounded-l-md transition-colors disabled:opacity-50"
                                            onClick={() => item.quantity > 1 ? updateQuantity(item.product.id, item.quantity - 1) : removeItem(item.product.id)}
                                        >
                                            {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-destructive" /> : <Minus className="w-3.5 h-3.5" />}
                                        </button>
                                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                                        <button
                                            className="w-7 h-7 flex items-center justify-center text-primary hover:bg-primary/10 rounded-r-md transition-colors"
                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>

            <div className="space-y-4 p-4 border-t bg-card shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.05)] z-10 shrink-0">
                <div className="space-y-1 mb-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{t('pos.subtotal')}</span>
                        <span>{formatCurrency(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-emerald-600">
                        <span>{t('pos.discount')}</span>
                        <span>{formatCurrency(0)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-black text-2xl tracking-tight">
                        <span>{t('pos.total')}</span>
                        <span className="text-primary">{formatCurrency(cartTotal)}</span>
                    </div>
                </div>

                {effectiveRole !== 'waiter' && (
                    <div className="grid grid-cols-3 gap-2">
                        <Button variant="outline" className="flex flex-col h-14 bg-background hover:border-primary/50" disabled={cartItems.length === 0 || processCheckout.isPending} onClick={() => handleCheckout('cash')}>
                            <Banknote className="w-4 h-4 mb-1 text-emerald-600" />
                            <span className="text-[10px]">{t('pos.cash')}</span>
                        </Button>
                        <Button variant="outline" className="flex flex-col h-14 bg-background hover:border-primary/50" disabled={cartItems.length === 0 || processCheckout.isPending} onClick={() => handleCheckout('credit')}>
                            <CreditCard className="w-4 h-4 mb-1 text-blue-600" />
                            <span className="text-[10px]">{t('pos.card')}</span>
                        </Button>
                        <Button variant="outline" className="flex flex-col h-14 bg-background hover:border-primary/50" disabled={cartItems.length === 0 || processCheckout.isPending} onClick={() => handleCheckout('pix')}>
                            <QrCode className="w-4 h-4 mb-1 text-teal-600" />
                            <span className="text-[10px]">{t('pos.pix')}</span>
                        </Button>
                    </div>
                )}

                <div className="grid grid-cols-[1fr_2fr] gap-2 pt-2">
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
                        onClick={clearCart}
                        disabled={cartItems.length === 0 || processCheckout.isPending}
                    >
                        {t('pos.cancel')}
                    </Button>
                    <Button
                        size="lg"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/20 text-lg"
                        disabled={cartItems.length === 0 || !selectedTable || processCheckout.isPending}
                        onClick={() => handleCheckout('none')}
                    >
                        {processCheckout.isPending ? <Loader2 className="animate-spin w-5 h-5" /> : t('pos.saveToTable')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
