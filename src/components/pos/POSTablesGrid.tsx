import { Badge } from "@/components/ui/badge";

interface POSTablesGridProps {
    t: (key: string) => string;
    tables: { id: string; name: string; status: string; capacity: number;[key: string]: unknown }[];
    selectedTable: string | null;
    setSelectedTable: (id: string | null) => void;
    setActiveTab: (tab: 'products' | 'orders' | 'tables') => void;
}

export function POSTablesGrid({
    t,
    tables,
    selectedTable,
    setSelectedTable,
    setActiveTab
}: POSTablesGridProps) {
    return (
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
    );
}
