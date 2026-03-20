import { Link } from "react-router-dom";
import { ChevronLeft, LayoutGrid, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";

interface POSHeaderProps {
    readonly t: (key: string) => string;
    readonly user: { readonly user_metadata?: { readonly first_name?: string }; readonly [key: string]: unknown } | null;
    readonly session: { readonly id: string; readonly [key: string]: unknown };
    readonly tables: ReadonlyArray<{ readonly id: string; readonly status: string; readonly [key: string]: unknown }>;
    readonly activeTab: 'products' | 'orders' | 'tables';
    readonly setActiveTab: (tab: 'products' | 'orders' | 'tables') => void;
    readonly closeSession: { readonly mutate: (args: { readonly id: string; readonly closingBalance: number }) => void; readonly isPending: boolean };
}

export function POSHeader({
    t,
    user,
    session,
    tables,
    activeTab,
    setActiveTab,
    closeSession
}: POSHeaderProps) {
    return (
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
                    <button
                        className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'orders' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mb-0.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                        {t('pos.orders') || 'Pedidos'}
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
    );
}
