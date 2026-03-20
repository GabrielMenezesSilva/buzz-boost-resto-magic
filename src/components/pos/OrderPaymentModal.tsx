import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/currency";
import { Banknote, CreditCard, QrCode } from "lucide-react";
import { useState } from "react";

interface OrderPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    order: any;
    onConfirmPayment: (method: 'cash' | 'credit' | 'debit' | 'pix') => void;
    t: (key: string) => string;
    isProcessing: boolean;
}

export function OrderPaymentModal({ isOpen, onClose, order, onConfirmPayment, t, isProcessing }: OrderPaymentModalProps) {
    const [selectedMethod, setSelectedMethod] = useState<'cash' | 'credit' | 'debit' | 'pix' | null>(null);

    if (!order) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Finalizar Pedido {order.table_id ? 'da Mesa' : `#${order.id.substring(0, 4)}`}</DialogTitle>
                    <DialogDescription>
                        Revise os itens e escolha a forma de pagamento.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {order.order_items?.map((item: any, i: number) => (
                            <div key={i} className="flex justify-between text-sm">
                                <div>
                                    <span className="font-medium">{item.quantity}x</span> {item.product_name}
                                </div>
                                <span className="text-muted-foreground">{formatCurrency(item.subtotal)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t flex justify-between items-center text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-primary">{formatCurrency(order.total)}</span>
                    </div>

                    <div className="pt-4">
                        <label className="text-sm font-medium mb-3 block">Forma de Pagamento</label>
                        <div className="grid grid-cols-3 gap-2">
                            <Button
                                type="button"
                                variant={selectedMethod === 'cash' ? 'default' : 'outline'}
                                className={`flex flex-col h-auto py-3 gap-1 ${selectedMethod === 'cash' ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                                onClick={() => setSelectedMethod('cash')}
                            >
                                <Banknote className="h-5 w-5" />
                                <span className="text-xs">Dinheiro</span>
                            </Button>
                            <Button
                                type="button"
                                variant={selectedMethod === 'credit' ? 'default' : 'outline'}
                                className={`flex flex-col h-auto py-3 gap-1 ${selectedMethod === 'credit' ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                                onClick={() => setSelectedMethod('credit')}
                            >
                                <CreditCard className="h-5 w-5" />
                                <span className="text-xs">Cartão</span>
                            </Button>
                            <Button
                                type="button"
                                variant={selectedMethod === 'pix' ? 'default' : 'outline'}
                                className={`flex flex-col h-auto py-3 gap-1 ${selectedMethod === 'pix' ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                                onClick={() => setSelectedMethod('pix')}
                            >
                                <QrCode className="h-5 w-5" />
                                <span className="text-xs">PIX</span>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => selectedMethod && onConfirmPayment(selectedMethod)}
                        disabled={!selectedMethod || isProcessing}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        {isProcessing ? t('pos.processing') || 'Processando...' : t('pos.confirmPayment') || 'Confirmar Pagamento'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
