import { useState } from 'react';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Edit, Trash2, Truck } from 'lucide-react';

export default function Suppliers() {
    const { t } = useLanguage();
    const { suppliers, isLoading, deleteSupplier, addSupplier } = useSuppliers();
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newSup, setNewSup] = useState({ name: '', contact_name: '', phone: '', email: '', notes: '' });

    const handleCreate = async () => {
        if (!newSup.name.trim()) return;
        await addSupplier.mutateAsync(newSup);
        setIsAddModalOpen(false);
        setNewSup({ name: '', contact_name: '', phone: '', email: '', notes: '' });
    };

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
                        <Truck className="mr-3 h-8 w-8 text-primary" />
                        {t('suppliers.title')}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {t('suppliers.subtitle')}
                    </p>
                </div>

                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('suppliers.new')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('suppliers.new')}</DialogTitle>
                            <DialogDescription>
                                {t('suppliers.descNew')}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>{t('common.name')} (Empresa) <span className="text-red-500">*</span></Label>
                                <Input
                                    value={newSup.name}
                                    onChange={(e) => setNewSup({ ...newSup, name: e.target.value })}
                                    placeholder={t('suppliers.placeholder1')}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>{t('suppliers.contactName')}</Label>
                                    <Input
                                        value={newSup.contact_name}
                                        onChange={(e) => setNewSup({ ...newSup, contact_name: e.target.value })}
                                        placeholder={t('suppliers.placeholder2')}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('suppliers.phone')}</Label>
                                    <Input
                                        value={newSup.phone}
                                        onChange={(e) => setNewSup({ ...newSup, phone: e.target.value })}
                                        placeholder={t('suppliers.placeholder3')}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>{t('suppliers.email')}</Label>
                                <Input
                                    type="email"
                                    value={newSup.email}
                                    onChange={(e) => setNewSup({ ...newSup, email: e.target.value })}
                                    placeholder={t('suppliers.placeholder4')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('suppliers.notes')}</Label>
                                <Textarea
                                    value={newSup.notes}
                                    onChange={(e) => setNewSup({ ...newSup, notes: e.target.value })}
                                    placeholder={t('suppliers.placeholder5')}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                                {t('common.cancel')}
                            </Button>
                            <Button onClick={handleCreate} disabled={addSupplier.isPending}>
                                {addSupplier.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {t('common.save')}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('suppliers.title')}</CardTitle>
                    <CardDescription>{t('suppliers.subtitle')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>{t('common.name')}</TableHead>
                                    <TableHead>{t('suppliers.tableContact')}</TableHead>
                                    <TableHead>{t('suppliers.tablePhone')}</TableHead>
                                    <TableHead>{t('suppliers.tableEmail')}</TableHead>
                                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {suppliers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">{t('suppliers.empty')}</TableCell>
                                    </TableRow>
                                ) : (
                                    suppliers.map(sup => (
                                        <TableRow key={sup.id}>
                                            <TableCell className="font-medium">{sup.name}</TableCell>
                                            <TableCell>{sup.contact_name || '-'}</TableCell>
                                            <TableCell>{sup.phone || '-'}</TableCell>
                                            <TableCell>{sup.email || '-'}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive"
                                                    onClick={() => setSupplierToDelete(sup.id)}
                                                    disabled={deleteSupplier.isPending && isDeleting === sup.id}
                                                >
                                                    {deleteSupplier.isPending && isDeleting === sup.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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
            <Dialog open={!!supplierToDelete} onOpenChange={(open) => !open && setSupplierToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('common.confirmAction')}</DialogTitle>
                        <DialogDescription className="mt-2 text-sm text-muted-foreground">
                            {t('suppliers.deleteConfirm') || "Você tem certeza que quer excluir este fornecedor?"}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-4 flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setSupplierToDelete(null)}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={deleteSupplier.isPending}
                            onClick={async () => {
                                if (supplierToDelete) {
                                    setIsDeleting(supplierToDelete);
                                    try {
                                        await deleteSupplier.mutateAsync(supplierToDelete);
                                        setSupplierToDelete(null);
                                    } finally {
                                        setIsDeleting(null);
                                    }
                                }
                            }}
                        >
                            {deleteSupplier.isPending ? t('common.deleting') : t('common.delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
