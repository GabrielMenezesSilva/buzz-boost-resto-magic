import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePosSession } from "@/hooks/usePosSession";
import { useTables } from "@/hooks/useTables";
import { useOrders } from "@/hooks/useOrders";
import { useEmployees } from "@/hooks/useEmployees";
import { useCart } from "@/hooks/useCart";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    ChevronLeft,
    ShoppingCart,
    LayoutGrid,
    Search,
    Plus,
    Minus,
    Trash2,
    Coffee,
    CreditCard,
    Banknote,
    QrCode
} from "lucide-react";

export default function POS() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const { session, isLoading: sessionLoading, openSession, closeSession } = usePosSession();
    const { tables } = useTables();
    const { activeOrders } = useOrders(session?.id);
    const { data: products = [], isLoading: productsLoading } = useProducts();
    const { data: categories = [] } = useCategories();

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

    if (sessionLoading || productsLoading) {
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

    // Handlers
    const handleProductClick = (product: any) => {
        if (!selectedTable) {
            alert(t('pos.selectTable'));
            setActiveTab('tables');
            return;
        }
        addItem(product);
    };

    return (
        <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
            {/* POS Top Bar */}
            <header className="h-16 bg-card border-b flex items-center justify-between px-4 shrink-0 shadow-sm z-10 w-full">
                <div className="flex items-center space-x-4">
                    <Link to="/dashboard">
                        <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 hover:bg-muted">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold leading-none hidden sm:block">{t('pos.pointOfSale')}</h1>
                        <p className="text-xs text-muted-foreground mt-1 hidden sm:block">{t('pos.session')} {session.id.substring(0, 6)} • {tables.length} {t('pos.tables')}</p>
                    </div>
                </div>

                {/* Tab Navigation Centered (if enough space) */}
                <div className="flex-1 flex justify-center max-w-md mx-4">
                    <div className="flex bg-muted p-1 rounded-lg w-full">
                        <button
                            className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'products' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setActiveTab('products')}
                        >
                            <LayoutGrid className="w-4 h-4 mb-0.5" />
                            {t('pos.catalog')}
                        </button>
                        <button
                            className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'tables' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setActiveTab('tables')}
                        >
                            <Coffee className="w-4 h-4 mb-0.5" />
                            {t('pos.tables')} <span className="ml-1 opacity-70">({tables.filter(t => t.status === 'occupied').length}/{tables.length})</span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium">{user?.user_metadata?.first_name || t('pos.operator')}</p>
                        <p className="text-xs text-emerald-600 font-medium tracking-wide">{t('pos.openStatus')}</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive hover:text-white transition-colors border-destructive/30"
                        onClick={() => closeSession.mutate({ id: session.id, closingBalance: 0 })}
                        disabled={closeSession.isPending}
                    >
                        {closeSession.isPending ? t('pos.closing') : t('pos.closeCashier')}
                    </Button>
                </div>
            </header>

            {/* POS Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Pane: Products / Tables Grid */}
                <div className="flex-1 flex flex-col bg-muted/10">

                    {activeTab === 'products' && (
                        <>
                            {/* Categories Bar */}
                            <div className="p-3 border-b bg-background flex items-center space-x-2 overflow-x-auto no-scrollbar shrink-0 shadow-sm">
                                <Button
                                    variant={selectedCategory === null ? 'default' : 'outline'}
                                    size="sm"
                                    className={`rounded-full px-5 ${selectedCategory === null ? 'bg-primary text-white' : 'bg-background hover:bg-muted font-medium'}`}
                                    onClick={() => setSelectedCategory(null)}
                                >
                                    {t('pos.all')}
                                </Button>
                                {categories.map(cat => (
                                    <Button
                                        key={cat.id}
                                        variant={selectedCategory === cat.id ? 'default' : 'outline'}
                                        size="sm"
                                        className={`rounded-full px-5 ${selectedCategory === cat.id ? 'bg-primary text-white' : 'bg-background hover:bg-muted font-medium'}`}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        style={selectedCategory === cat.id ? { backgroundColor: cat.color || 'var(--primary)' } : { borderColor: cat.color ? `${cat.color}40` : '' }}
                                    >
                                        <span className="mr-2">{cat.icon || '🍽️'}</span>
                                        {cat.name}
                                    </Button>
                                ))}
                            </div>

                            {/* Product Grid */}
                            <ScrollArea className="flex-1 p-4">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {filteredProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="group bg-card border rounded-xl overflow-hidden cursor-pointer hover:border-primary/50 hover:shadow-md transition-all flex flex-col active:scale-95"
                                            onClick={() => handleProductClick(product)}
                                        >
                                            <div className="aspect-video bg-muted/50 relative overflow-hidden flex items-center justify-center">
                                                {product.image_url ? (
                                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                ) : (
                                                    <span className="text-4xl">{product.category?.icon || '🍽️'}</span>
                                                )}
                                                {product.current_stock <= product.min_stock && (
                                                    <Badge variant="destructive" className="absolute top-2 right-2 text-[10px] px-1.5 py-0 h-4 uppercase">
                                                        {t('pos.lowStock')}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="p-3 flex-1 flex flex-col">
                                                <p className="font-medium text-sm leading-tight line-clamp-2">{product.name}</p>
                                                <div className="mt-auto pt-2 flex items-center justify-between">
                                                    <p className="text-primary font-bold">R$ {product.sell_price.toFixed(2).replace('.', ',')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {filteredProducts.length === 0 && (
                                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-muted-foreground">
                                            <Search className="h-12 w-12 mb-4 opacity-20" />
                                            <p>{t('pos.noProducts')}</p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </>
                    )}

                    {activeTab === 'tables' && (
                        <div className="flex-1 p-6 overflow-auto">
                            <h2 className="text-lg font-bold mb-4">{t('pos.chooseTable')}</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {tables.map(table => (
                                    <div
                                        key={table.id}
                                        onClick={() => {
                                            setSelectedTable(table.id);
                                            setActiveTab('products');
                                        }}
                                        className={`h-24 rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${selectedTable === table.id
                                            ? 'border-primary bg-primary/10 ring-2 ring-primary ring-offset-2'
                                            : table.status === 'occupied'
                                                ? 'border-amber-500/50 bg-amber-500/10'
                                                : 'border-muted bg-card hover:border-primary/40'
                                            }`}
                                    >
                                        <p className="font-bold text-lg">{table.name}</p>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <Badge variant={table.status === 'occupied' ? 'outline' : 'secondary'} className={table.status === 'occupied' ? 'text-amber-600 border-amber-600' : ''}>
                                                {table.status === 'occupied' ? t('pos.occupied') : t('pos.free')}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">{table.capacity} {t('pos.seats')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* Right Pane: Cart / Checkout Workspace */}
                <div className="w-[380px] flex flex-col bg-background border-l shrink-0 shadow-[-4px_0_24px_-12px_rgba(0,0,0,0.1)] z-20">

                    {/* Cart Header */}
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

                    {/* Cart Items */}
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
                                            <p className="text-xs text-muted-foreground font-medium mt-0.5">R$ {item.product.sell_price.toFixed(2).replace('.', ',')} {t('pos.un')}</p>
                                        </div>

                                        <div className="flex flex-col items-end shrink-0">
                                            <p className="font-bold text-sm mb-2">R$ {(item.product.sell_price * item.quantity).toFixed(2).replace('.', ',')}</p>

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

                    {/* Checkout Panel */}
                    <div className="space-y-4 p-4 border-t bg-card shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.05)] z-10 shrink-0">
                        <div className="space-y-1 mb-2">
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>{t('pos.subtotal')}</span>
                                <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div className="flex justify-between text-sm text-emerald-600">
                                <span>{t('pos.discount')}</span>
                                <span>R$ 0,00</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between font-black text-2xl tracking-tight">
                                <span>{t('pos.total')}</span>
                                <span className="text-primary">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <Button variant="outline" className="flex flex-col h-14 bg-background hover:border-primary/50" disabled={cartItems.length === 0}>
                                <Banknote className="w-4 h-4 mb-1 text-emerald-600" />
                                <span className="text-[10px]">{t('pos.cash')}</span>
                            </Button>
                            <Button variant="outline" className="flex flex-col h-14 bg-background hover:border-primary/50" disabled={cartItems.length === 0}>
                                <CreditCard className="w-4 h-4 mb-1 text-blue-600" />
                                <span className="text-[10px]">{t('pos.card')}</span>
                            </Button>
                            <Button variant="outline" className="flex flex-col h-14 bg-background hover:border-primary/50" disabled={cartItems.length === 0}>
                                <QrCode className="w-4 h-4 mb-1 text-teal-600" />
                                <span className="text-[10px]">{t('pos.pix')}</span>
                            </Button>
                        </div>

                        <div className="grid grid-cols-[1fr_2fr] gap-2 pt-2">
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
                                onClick={clearCart}
                                disabled={cartItems.length === 0}
                            >
                                {t('pos.cancel')}
                            </Button>
                            <Button
                                size="lg"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/20 text-lg"
                                disabled={cartItems.length === 0 || !selectedTable}
                            >
                                {t('pos.sendOrder')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
