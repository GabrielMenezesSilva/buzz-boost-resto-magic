import { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Edit, Trash2, Tag } from 'lucide-react';

export default function Categories() {
    const { t } = useLanguage();
    const { categories, isLoading, deleteCategory, addCategory } = useCategories();
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newCat, setNewCat] = useState({ name: '', description: '', color: '#3b82f6' });

    const handleCreate = async () => {
        if (!newCat.name.trim()) return;
        await addCategory.mutateAsync({
            name: newCat.name,
            description: newCat.description,
            color: newCat.color
        });
        setIsAddModalOpen(false);
        setNewCat({ name: '', description: '', color: '#3b82f6' });
    };

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
                        <Tag className="mr-3 h-8 w-8 text-primary" />
                        {t('categories.title')}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {t('categories.subtitle')}
                    </p>
                </div>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('categories.new')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('categories.new')}</DialogTitle>
                            <DialogDescription>
                                {t('categories.descNew')}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>{t('common.name')}</Label>
                                <Input
                                    value={newCat.name}
                                    onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                                    placeholder={t('categories.placeholder1')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('common.description')}</Label>
                                <Textarea
                                    value={newCat.description}
                                    onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                                    placeholder={t('categories.placeholder2')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('categories.color')}</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        value={newCat.color}
                                        onChange={(e) => setNewCat({ ...newCat, color: e.target.value })}
                                        className="w-16 h-10 p-1"
                                    />
                                    <Input
                                        value={newCat.color}
                                        onChange={(e) => setNewCat({ ...newCat, color: e.target.value })}
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                                {t('common.cancel')}
                            </Button>
                            <Button onClick={handleCreate} disabled={addCategory.isPending}>
                                {addCategory.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {t('common.save')}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('categories.tableTitle')}</CardTitle>
                    <CardDescription>{t('categories.tableDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>{t('categories.tableColor')}</TableHead>
                                    <TableHead>{t('common.name')}</TableHead>
                                    <TableHead>{t('common.description')}</TableHead>
                                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">{t('categories.empty')}</TableCell>
                                    </TableRow>
                                ) : (
                                    categories.map(cat => (
                                        <TableRow key={cat.id}>
                                            <TableCell>
                                                <div className="w-6 h-6 rounded-full border shadow-sm" style={{ backgroundColor: cat.color || '#ccc' }}></div>
                                            </TableCell>
                                            <TableCell className="font-medium">{cat.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{cat.description || '-'}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive"
                                                    onClick={() => setCategoryToDelete(cat.id)}
                                                    disabled={deleteCategory.isPending && isDeleting === cat.id}
                                                >
                                                    {deleteCategory.isPending && isDeleting === cat.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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
            <Dialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('common.confirmAction')}</DialogTitle>
                        <DialogDescription className="mt-2 text-sm text-muted-foreground">
                            {t('categories.deleteConfirm')}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-4 flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setCategoryToDelete(null)}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={deleteCategory.isPending}
                            onClick={async () => {
                                if (categoryToDelete) {
                                    setIsDeleting(categoryToDelete);
                                    try {
                                        await deleteCategory.mutateAsync(categoryToDelete);
                                        setCategoryToDelete(null);
                                    } finally {
                                        setIsDeleting(null);
                                    }
                                }
                            }}
                        >
                            {deleteCategory.isPending ? t('common.deleting') : t('common.delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
