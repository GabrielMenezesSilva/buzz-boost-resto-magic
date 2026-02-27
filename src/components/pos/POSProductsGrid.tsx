import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface POSProductsGridProps {
    t: (key: string) => string;
    categories: { id: string; name: string; color?: string; icon?: string;[key: string]: unknown }[];
    selectedCategory: string | null;
    setSelectedCategory: (id: string | null) => void;
    filteredProducts: { id: string; name: string; sell_price: number; image_url?: string; current_stock: number; min_stock: number; category?: { icon?: string;[key: string]: unknown };[key: string]: unknown }[];
    handleProductClick: (product: { id: string; name: string; sell_price: number; image_url?: string; current_stock: number; min_stock: number; category?: { icon?: string;[key: string]: unknown };[key: string]: unknown }) => void;
}

export function POSProductsGrid({
    t,
    categories,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
    handleProductClick
}: POSProductsGridProps) {
    return (
        <>
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
                            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: `${categories.find(c => c.id === selectedCategory)?.color || '#ccc'}20`, color: categories.find(c => c.id === selectedCategory)?.color || '#ccc' }}>
                                <span className="text-xl">{(categories.find(c => c.id === selectedCategory))?.icon || '🏷️'}</span>
                            </div>
                            <p>{t('pos.noProducts')}</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </>
    );
}
