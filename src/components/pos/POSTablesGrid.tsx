import { Badge } from "@/components/ui/badge";

interface POSTablesGridProps {
    readonly t: (key: string) => string;
    readonly tables: { id: string; name: string; status: string; capacity: number;[key: string]: unknown }[];
    readonly selectedTable: string | null;
    readonly setSelectedTable: (id: string | null) => void;
    readonly setActiveTab: (tab: 'products' | 'orders' | 'tables') => void;
}

export function POSTablesGrid({
    t,
    tables,
    selectedTable,
    setSelectedTable,
    setActiveTab
}: POSTablesGridProps) {
    const getTableClassName = (tableId: string, status: string) => {
        if (selectedTable === tableId) {
            return 'border-primary bg-primary/10 ring-2 ring-primary ring-offset-2';
        }
        if (status === 'occupied') {
            return 'border-amber-500/50 bg-amber-500/10';
        }
        return 'border-muted bg-card hover:border-primary/40';
    };

    return (
        <div className="flex-1 p-6 overflow-auto">
            <h2 className="text-lg font-bold mb-4">{t('pos.chooseTable')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {tables.map(table => (
                    <div
                        key={table.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                            setSelectedTable(table.id);
                            setActiveTab('products');
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedTable(table.id);
                                setActiveTab('products');
                            }
                        }}
                        className={`h-24 rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${getTableClassName(table.id, table.status)}`}
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
    );
}
