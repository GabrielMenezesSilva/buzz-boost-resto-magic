import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
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

export default function POS() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const { session, isLoading: sessionLoading, openSession, closeSession } = usePosSession();

    const { activeOrders, processCheckout } = useOrders(session?.id);
    const { tables, isLoading: isLoadingTables } = useTables();
    const { products = [], isLoading: productsLoading } = useProducts();
    const { categories = [] } = useCategories();

    // Cart from Zustand
    const { items: cartItems, addItem, removeItem, updateQuantity, clearCart } = useCart();

    const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'tables'>('products');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedTable, setSelectedTable] = useState<string | null>(null);

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
                user={user as any}
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
                />
            </div>
        </div>
    );
}
