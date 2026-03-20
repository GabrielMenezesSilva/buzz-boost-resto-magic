import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Employee } from "@/types/pos";
import { usePosSession } from "@/hooks/usePosSession";
import { useTables } from "@/hooks/useTables";
import { useOrders } from "@/hooks/useOrders";
import { useCart } from "@/hooks/useCart";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import { toast } from 'sonner';

import { POSHeader } from "@/components/pos/POSHeader";
import { POSCart } from "@/components/pos/POSCart";
import { POSProductsGrid } from "@/components/pos/POSProductsGrid";
import { POSTablesGrid } from "@/components/pos/POSTablesGrid";
import { POSOrdersGrid } from "@/components/pos/POSOrdersGrid";
import { OrderPaymentModal } from "@/components/pos/OrderPaymentModal";
import { Order } from "@/types/pos";

export default function POS() {
    const { user, profile, activeEmployee } = useAuth();
    const effectiveRole = activeEmployee?.role || profile?.role || 'user';
    const { t } = useLanguage();
    const { session, isLoading: sessionLoading, openSession, closeSession } = usePosSession();

    const { activeOrders, processCheckout, processPayment } = useOrders(session?.id);
    const { tables, isLoading: isLoadingTables } = useTables();
    const { products = [], isLoading: productsLoading } = useProducts();
    const { categories = [] } = useCategories();

    // Cart from Zustand
    const { items: cartItems, addItem, removeItem, updateQuantity, clearCart } = useCart();

    const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'tables'>('products');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    // Derived State
    const filteredProducts = useMemo(() => {
        if (!selectedCategory) return products;
        return products.filter(p => p.category_id === selectedCategory);
    }, [products, selectedCategory]);

    const cartTotal = cartItems.reduce((acc, item) => acc + (item.product.sell_price * item.quantity), 0);
    const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    // Handlers
    const handleProductClick = (product: import('@/hooks/useProducts').Product) => {
        if (!selectedTable) {
            toast.error(t('pos.selectTable'));
            setActiveTab('tables');
            return;
        }
        addItem(product);
    };

    const handleSelectOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsPaymentModalOpen(true);
    };

    const handleConfirmPayment = async (method: 'cash' | 'credit' | 'debit' | 'pix') => {
        if (!selectedOrder) return;
        try {
            await processPayment.mutateAsync({
                order_id: selectedOrder.id,
                method: method,
                amount: selectedOrder.total,
                change_given: 0,
                reference: null,
                total_order: selectedOrder.total
            });
            setIsPaymentModalOpen(false);
            setSelectedOrder(null);
            if (activeTab === 'orders') setActiveTab('tables');
        } catch (error) {
            console.error('Error processing payment:', error);
        }
    };

    const handleCheckout = async (method: 'cash' | 'credit' | 'pix' | 'none') => {
        if (cartItems.length === 0) return;
        if (method === 'none' && !selectedTable) {
            toast.error(t('pos.selectTableError') || 'Selecione uma mesa para enviar o pedido para a cozinha.');
            return;
        }

        try {
            await processCheckout.mutateAsync({
                cartItems,
                total: cartTotal,
                method,
                table_id: selectedTable || undefined
            });
            clearCart();
            setSelectedTable(null); // Clear selected table after checkout
            toast.success(t('pos.orderSentSuccess') || 'Pedido enviado com sucesso!');
        } catch (error) {
            console.error(error);
            toast.error(t('pos.orderSentError') || 'Erro ao enviar o pedido.');
        }
    };

    if (sessionLoading || productsLoading || isLoadingTables) {
        return <div className="h-screen w-full flex items-center justify-center">{t('pos.loading')}</div>;
    }

    if (!session) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center p-6 bg-muted/20">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
                    <LayoutGrid className="h-8 w-8 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold mb-2">{t('pos.closed')}</h1>
                <p className="text-muted-foreground mb-8 text-center max-w-sm">{t('pos.closedDesc')}</p>
                <Button
                    size="lg"
                    className="bg-gradient-primary w-full max-w-sm"
                    onClick={() => openSession.mutate(0)}
                    disabled={openSession.isPending}
                >
                    {openSession.isPending ? t('pos.opening') : t('pos.openCashier')}
                </Button>
                <Link to="/dashboard" className="mt-6 text-primary hover:underline font-medium">
                    {t('pos.backDashboard')}
                </Link>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
            <POSHeader
                t={t}
                user={user}
                session={session}
                tables={tables}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                closeSession={closeSession}
            />

            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 flex flex-col bg-muted/10">
                    {activeTab === 'products' && (
                        <POSProductsGrid
                            t={t}
                            categories={categories}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            filteredProducts={filteredProducts}
                            handleProductClick={handleProductClick}
                        />
                    )}

                    {activeTab === 'tables' && (
                        <POSTablesGrid
                            t={t}
                            tables={tables}
                            selectedTable={selectedTable}
                            setSelectedTable={setSelectedTable}
                            setActiveTab={setActiveTab}
                        />
                    )}

                    {activeTab === 'orders' && (
                        <POSOrdersGrid
                            t={t}
                            activeOrders={activeOrders}
                            tables={tables}
                            handleSelectOrder={handleSelectOrder}
                        />
                    )}
                </div>

                <POSCart
                    t={t}
                    cartItems={cartItems}
                    cartTotal={cartTotal}
                    cartItemCount={cartItemCount}
                    selectedTable={selectedTable}
                    setSelectedTable={setSelectedTable}
                    tables={tables}
                    updateQuantity={updateQuantity}
                    removeItem={removeItem}
                    clearCart={clearCart}
                    processCheckout={processCheckout}
                    handleCheckout={handleCheckout}
                    effectiveRole={effectiveRole}
                />
            </div>

            <OrderPaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                order={selectedOrder}
                onConfirmPayment={handleConfirmPayment}
                t={t}
                isProcessing={processPayment.isPending}
            />
        </div>
    );
}
