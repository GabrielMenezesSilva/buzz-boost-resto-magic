import { useState } from 'react';
import { useInventoryAlerts } from '@/hooks/useInventoryAlerts';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Archive, AlertTriangle, CalendarRange, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProducts } from '@/hooks/useProducts';

export default function Inventory() {
    const { t } = useLanguage();
    const { alerts, isLoading: loadingAlerts } = useInventoryAlerts();
    const { products, addStock } = useProducts();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [addAmount, setAddAmount] = useState('');
    const [addReason, setAddReason] = useState('');
    const [addBatch, setAddBatch] = useState('');
    const [addExpiry, setAddExpiry] = useState('');

    const handleAddStock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct || !addAmount || Number(addAmount) <= 0) return;
        try {
            await addStock.mutateAsync({
                id: selectedProduct,
                amount: Number(addAmount),
                reason: addReason,
                batch: addBatch,
                expiryDate: addExpiry || undefined
            });
            setIsAddOpen(false);
            setSelectedProduct('');
            setAddAmount('');
            setAddReason('');
            setAddBatch('');
            setAddExpiry('');
        } catch (error) {
            console.error(error);
        }
    };

    if (loadingAlerts) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
                        <Archive className="mr-3 h-8 w-8 text-primary" />
                        {t('nav.inventory')}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {t('inventory.subtitle')}
                    </p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="shrink-0 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 hover:border-primary/40 transition-colors shadow-sm">
                            <Plus className="mr-2 h-4 w-4" />
                            {t('inventory.addStockBtn')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{t('inventory.addStockTitle')}</DialogTitle>
                            <DialogDescription>
                                {t('inventory.addStockDesc')}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddStock} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>{t('inventory.product')}</Label>
                                <Select value={selectedProduct} onValueChange={setSelectedProduct} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('inventory.selectProduct')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map(p => (
                                            <SelectItem key={p.id} value={p.id}>
                                                {p.name} (Atual: {p.current_stock})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>{t('inventory.amountToAdd')}</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    step="0.01"
                                    required
                                    value={addAmount}
                                    onChange={e => setAddAmount(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('inventory.addReason')}</Label>
                                <Textarea
                                    placeholder={t('inventory.addReasonPlaceholder')}
                                    value={addReason}
                                    onChange={e => setAddReason(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>{t('products.batch') || 'Lote (Opcional)'}</Label>
                                    <Input
                                        placeholder="Ex: L12345"
                                        value={addBatch}
                                        onChange={e => setAddBatch(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('products.expiry') || 'Validade (Opcional)'}</Label>
                                    <Input
                                        type="date"
                                        value={addExpiry}
                                        onChange={e => setAddExpiry(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={!selectedProduct || !addAmount || addStock.isPending}>
                                    {addStock.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                    {t('inventory.saveStock')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Low Stock Alerts */}
                <Card className="border-red-500/20 shadow-sm">
                    <CardHeader className="bg-red-500/5 pb-4">
                        <CardTitle className="text-red-600 flex items-center">
                            <AlertTriangle className="mr-2 h-5 w-5" />
                            {t('inventory.lowStock')}
                        </CardTitle>
                        <CardDescription>{t('inventory.lowStockDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="rounded-b-md">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30">
                                        <TableHead>{t('inventory.product')}</TableHead>
                                        <TableHead className="text-right">{t('inventory.currentStock')}</TableHead>
                                        <TableHead className="text-right">{t('inventory.minimum')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {alerts.lowStock.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-20 text-center text-muted-foreground">{t('inventory.allGood')}</TableCell>
                                        </TableRow>
                                    ) : (
                                        alerts.lowStock.map(prod => (
                                            <TableRow key={prod.id}>
                                                <TableCell className="font-medium">{prod.name}</TableCell>
                                                <TableCell className="text-right text-red-600 font-bold">{prod.current_stock} {prod.unit}</TableCell>
                                                <TableCell className="text-right text-muted-foreground">{prod.min_stock} {prod.unit}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Expiring Alerts */}
                <Card className="border-orange-500/20 shadow-sm">
                    <CardHeader className="bg-orange-500/5 pb-4">
                        <CardTitle className="text-orange-600 flex items-center">
                            <CalendarRange className="mr-2 h-5 w-5" />
                            {t('inventory.expiring')}
                        </CardTitle>
                        <CardDescription>{t('inventory.expiringDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="rounded-b-md">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30">
                                        <TableHead>{t('inventory.product')}</TableHead>
                                        <TableHead className="text-right">{t('inventory.expiryDate')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {alerts.expiring.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={2} className="h-20 text-center text-muted-foreground">{t('inventory.noExpiring')}</TableCell>
                                        </TableRow>
                                    ) : (
                                        alerts.expiring.map(prod => (
                                            <TableRow key={prod.id}>
                                                <TableCell className="font-medium">{prod.name}</TableCell>
                                                <TableCell className="text-right text-orange-600 font-bold">
                                                    {prod.expiry_date ? new Date(prod.expiry_date).toLocaleDateString('pt-BR') : '-'}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
