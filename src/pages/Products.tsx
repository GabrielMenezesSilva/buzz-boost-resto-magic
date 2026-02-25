import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useCategories } from '@/hooks/useCategories';
import { useSuppliers } from '@/hooks/useSuppliers';
import { Loader2, Plus, Edit, Trash2, Package } from 'lucide-react';

export default function Products() {
    const { t } = useLanguage();
    const { products, isLoading, deleteProduct, addProduct } = useProducts();
    const { categories } = useCategories();
    const { suppliers } = useSuppliers();

    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form state
    const [newProd, setNewProd] = useState({
        name: '', description: '', unit: 'un',
        cost_price: 0, sell_price: 0,
        current_stock: 0, min_stock: 0,
        category_id: '', supplier_id: ''
    });

    const handleCreate = async () => {
        if (!newProd.name.trim()) return;

        await addProduct.mutateAsync({
            name: newProd.name,
            description: newProd.description,
            unit: newProd.unit,
            cost_price: Number(newProd.cost_price),
            sell_price: Number(newProd.sell_price),
            current_stock: Number(newProd.current_stock),
            min_stock: Number(newProd.min_stock),
            category_id: newProd.category_id || null,
            supplier_id: newProd.supplier_id || null,
            active: true,
            show_in_pos: true
        });

        setIsAddModalOpen(false);
        setNewProd({
            name: '', description: '', unit: 'un',
            cost_price: 0, sell_price: 0, current_stock: 0, min_stock: 0,
            category_id: '', supplier_id: ''
        });
    };

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
                        <Package className="mr-3 h-8 w-8 text-primary" />
                        {t('products.title')}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {t('products.subtitle')}
                    </p>
                </div>

                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('products.new')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{t('products.new')}</DialogTitle>
                            <DialogDescription>
                                {t('products.descNew')}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                            <div className="space-y-2 md:col-span-2">
                                <Label>{t('common.name')} <span className="text-red-500">*</span></Label>
                                <Input
                                    value={newProd.name}
                                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                                    placeholder={t('products.placeholder1')}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>{t('products.category')}</Label>
                                <Select value={newProd.category_id} onValueChange={(val) => setNewProd({ ...newProd, category_id: val })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('products.selectPlaceholder')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">{t('products.noCategory')}</SelectItem>
                                        {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>{t('products.supplier')}</Label>
                                <Select value={newProd.supplier_id} onValueChange={(val) => setNewProd({ ...newProd, supplier_id: val })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('products.selectPlaceholder')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">{t('products.noSupplier')}</SelectItem>
                                        {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>{t('products.costPrice')}</Label>
                                <Input
                                    type="number" step="0.01" min="0"
                                    value={newProd.cost_price}
                                    onChange={(e) => setNewProd({ ...newProd, cost_price: Number(e.target.value) })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>{t('products.sellPrice')}</Label>
                                <Input
                                    type="number" step="0.01" min="0"
                                    value={newProd.sell_price}
                                    onChange={(e) => setNewProd({ ...newProd, sell_price: Number(e.target.value) })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>{t('products.initialStock')}</Label>
                                <Input
                                    type="number" step="0.01"
                                    value={newProd.current_stock}
                                    onChange={(e) => setNewProd({ ...newProd, current_stock: Number(e.target.value) })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>{t('products.minStock')}</Label>
                                <Input
                                    type="number" step="0.01" min="0"
                                    value={newProd.min_stock}
                                    onChange={(e) => setNewProd({ ...newProd, min_stock: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                                {t('common.cancel')}
                            </Button>
                            <Button onClick={handleCreate} disabled={addProduct.isPending}>
                                {addProduct.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {t('common.save')}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('products.title')}</CardTitle>
                    <CardDescription>{t('products.subtitle')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>{t('common.name')}</TableHead>
                                    <TableHead>{t('products.tableCategory')}</TableHead>
                                    <TableHead>{t('products.tablePrice')}</TableHead>
                                    <TableHead>{t('products.tableStock')}</TableHead>
                                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">{t('products.empty')}</TableCell>
                                    </TableRow>
                                ) : (
                                    products.map(prod => (
                                        <TableRow key={prod.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-muted rounded flex items-center justify-center overflow-hidden">
                                                        {prod.image_url ? <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" /> : <Package className="w-4 h-4 text-muted-foreground" />}
                                                    </div>
                                                    {prod.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {prod.category?.name ? (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border" style={{ borderColor: prod.category.color || '#ccc', color: prod.category.color || 'inherit' }}>
                                                        {prod.category.name}
                                                    </span>
                                                ) : '-'}
                                            </TableCell>
                                            <TableCell>R$ {Number(prod.sell_price).toFixed(2)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className={Number(prod.current_stock) <= Number(prod.min_stock) ? 'text-destructive font-bold' : ''}>
                                                        {prod.current_stock} {prod.unit}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive"
                                                    onClick={() => setProductToDelete(prod.id)}
                                                    disabled={deleteProduct.isPending && isDeleting === prod.id}
                                                >
                                                    {deleteProduct.isPending && isDeleting === prod.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('common.confirmAction')}</DialogTitle>
                        <DialogDescription className="mt-2 text-sm text-muted-foreground">
                            {t('products.deleteConfirm') || "Você tem certeza que quer excluir este produto?"}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-4 flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setProductToDelete(null)}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={deleteProduct.isPending}
                            onClick={async () => {
                                if (productToDelete) {
                                    setIsDeleting(productToDelete);
                                    try {
                                        await deleteProduct.mutateAsync(productToDelete);
                                        setProductToDelete(null);
                                    } finally {
                                        setIsDeleting(null);
                                    }
                                }
                            }}
                        >
                            {deleteProduct.isPending ? t('common.deleting') : t('common.delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
