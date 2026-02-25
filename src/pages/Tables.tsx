import { useState } from "react";
import { useTables } from "@/hooks/useTables";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coffee, Plus, Trash2, Edit2, LayoutGrid } from "lucide-react";
import {
    Table as UITable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Tables() {
    const { t } = useLanguage();
    const { tables, isLoading, addTable, updateTable, deleteTable, generateDefaultTables } = useTables();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [tableToDelete, setTableToDelete] = useState<string | null>(null);
    const [selectedTable, setSelectedTable] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: "",
        capacity: 4,
    });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addTable.mutate({
            name: formData.name,
            capacity: Number(formData.capacity) || 4,
            status: 'available',
            sort_order: tables.length
        });
        setIsAddOpen(false);
        setFormData({ name: "", capacity: 4 });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTable) return;
        updateTable.mutate({
            id: selectedTable.id,
            name: formData.name,
            capacity: Number(formData.capacity) || 4,
        });
        setIsEditOpen(false);
    };

    const openEdit = (table: any) => {
        setSelectedTable(table);
        setFormData({ name: table.name, capacity: table.capacity || 4 });
        setIsEditOpen(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-light/20 to-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{t('tables.title')}</h1>
                        <p className="text-muted-foreground mt-1">{t('tables.subtitle')}</p>
                    </div>

                    <div className="flex space-x-2 w-full sm:w-auto">
                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button className="w-full sm:w-auto bg-primary text-primary-foreground">
                                    <Plus className="w-4 h-4 mr-2" />
                                    {t('tables.newTable')}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{t('tables.addTable')}</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAdd} className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t('tables.nameLabel')}</label>
                                        <Input
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder={t('tables.namePlaceholder')}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t('tables.capacityLabel')}</label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={formData.capacity}
                                            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={addTable.isPending}>
                                        {addTable.isPending ? t('tables.saving') : t('tables.saveTable')}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {tables.length === 0 && !isLoading && (
                    <div className="bg-card border border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center">
                        <LayoutGrid className="w-12 h-12 text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-medium mb-2">{t('tables.emptyTitle')}</h3>
                        <p className="text-muted-foreground max-w-sm mb-6">{t('tables.emptyDesc')}</p>
                        <Button variant="outline" onClick={() => generateDefaultTables.mutate(10)} disabled={generateDefaultTables.isPending}>
                            <Coffee className="w-4 h-4 mr-2" />
                            {generateDefaultTables.isPending ? t('tables.generating') : t('tables.generateDefault')}
                        </Button>
                    </div>
                )}

                {tables.length > 0 && (
                    <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                        <UITable>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>{t('tables.tableName')}</TableHead>
                                    <TableHead>{t('tables.tableCapacity')}</TableHead>
                                    <TableHead>{t('tables.tableStatus')}</TableHead>
                                    <TableHead className="text-right">{t('tables.actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tables.map((table) => (
                                    <TableRow key={table.id}>
                                        <TableCell className="font-semibold">{table.name}</TableCell>
                                        <TableCell>{table.capacity} {t('tables.seats')}</TableCell>
                                        <TableCell>
                                            <Badge variant={table.status === 'occupied' ? 'destructive' : 'secondary'} className={table.status === 'occupied' ? 'bg-amber-500 hover:bg-amber-600 border-transparent text-white' : ''}>
                                                {table.status === 'occupied' ? t('tables.occupied') : t('tables.free')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(table)}>
                                                <Edit2 className="w-4 h-4 text-muted-foreground hover:text-primary" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={(e) => {
                                                e.preventDefault();
                                                setTableToDelete(table.id);
                                            }}>
                                                <Trash2 className="w-4 h-4 text-destructive/70 hover:text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </UITable>
                    </div>
                )}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('tables.editTitle')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('tables.tableName')}</label>
                            <Input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('tables.tableCapacity')}</label>
                            <Input
                                type="number"
                                min="1"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={updateTable.isPending}>
                            {updateTable.isPending ? t('tables.saving') : t('tables.saveChanges')}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={!!tableToDelete} onOpenChange={(open) => !open && setTableToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('tables.confirmDelete')}</DialogTitle>
                        <p className="text-sm text-muted-foreground mt-2">
                            {t('common.confirmAction')}
                        </p>
                    </DialogHeader>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setTableToDelete(null)}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (tableToDelete) {
                                    deleteTable.mutate(tableToDelete, {
                                        onSuccess: () => setTableToDelete(null)
                                    });
                                }
                            }}
                            disabled={deleteTable.isPending}
                        >
                            {deleteTable.isPending ? t('common.deleting') : t('common.delete')}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
