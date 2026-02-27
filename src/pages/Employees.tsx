import { useState } from "react";
import { useEmployees } from "@/hooks/useEmployees";
import { Employee } from "@/types/pos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, Trash2, Edit2, ShieldAlert } from "lucide-react";
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
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Employees() {
    const { t } = useLanguage();
    const { employees, isLoading, addEmployee, updateEmployee, deleteEmployee, generateDefaultOwner } = useEmployees();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

    const ROLE_LABELS: Record<string, string> = {
        'owner': t('employees.roleOwner'),
        'manager': t('employees.roleManager').split(' (')[0],
        'cashier': t('employees.roleCashier').split(' (')[0],
        'waiter': t('employees.roleWaiter').split(' (')[0]
    };

    const ROLE_COLORS: Record<string, string> = {
        'owner': 'bg-primary text-primary-foreground hover:bg-primary/80',
        'manager': 'bg-blue-500 text-white hover:bg-blue-600',
        'cashier': 'bg-amber-500 text-white hover:bg-amber-600',
        'waiter': 'bg-slate-500 text-white hover:bg-slate-600'
    };

    const [formData, setFormData] = useState({
        name: "",
        role: "waiter",
        phone: "",
        pin: ""
    });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addEmployee.mutate({
            name: formData.name,
            role: formData.role as Employee['role'],
            phone: formData.phone,
            pin: formData.pin,
            active: true
        });
        setIsAddOpen(false);
        setFormData({ name: "", role: "waiter", phone: "", pin: "" });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEmployee) return;
        updateEmployee.mutate({
            id: selectedEmployee.id,
            name: formData.name,
            role: formData.role as Employee['role'],
            phone: formData.phone,
            pin: formData.pin,
        });
        setIsEditOpen(false);
    };

    const openEdit = (emp: Employee) => {
        setSelectedEmployee(emp);
        setFormData({ name: emp.name, role: emp.role, phone: emp.phone || "", pin: emp.pin || "" });
        setIsEditOpen(true);
    };

    const activeEmployees = employees.filter(e => e.active);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-light/20 to-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{t('employees.title')}</h1>
                        <p className="text-muted-foreground mt-1">{t('employees.subtitle')}</p>
                    </div>

                    <div className="flex space-x-2 w-full sm:w-auto">
                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button className="w-full sm:w-auto bg-primary text-primary-foreground">
                                    <Plus className="w-4 h-4 mr-2" />
                                    {t('employees.newEmployee')}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{t('employees.addEmployee')}</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAdd} className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t('employees.nameLabel')}</label>
                                        <Input
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder={t('employees.namePlaceholder')}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">{t('employees.phoneLabel')}</label>
                                            <Input
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder={t('employees.phonePlaceholder')}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">{t('employees.pinLabel')}</label>
                                            <Input
                                                required
                                                type="password"
                                                maxLength={4}
                                                value={formData.pin}
                                                onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/[^0-9]/g, '') })}
                                                placeholder={t('employees.pinPlaceholder')}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t('employees.roleLabel')}</label>
                                        <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('employees.rolePlaceholder')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="waiter">{t('employees.roleWaiter')}</SelectItem>
                                                <SelectItem value="cashier">{t('employees.roleCashier')}</SelectItem>
                                                <SelectItem value="manager">{t('employees.roleManager')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-muted-foreground mt-1 text-justify">
                                            {t('employees.roleDesc')}
                                        </p>
                                    </div>
                                    <Button type="submit" className="w-full" disabled={addEmployee.isPending}>
                                        {addEmployee.isPending ? t('employees.saving') : t('employees.saveEmployee')}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {activeEmployees.length === 0 && !isLoading && (
                    <div className="bg-card border border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center">
                        <ShieldAlert className="w-12 h-12 text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-medium mb-2">{t('employees.emptyTitle')}</h3>
                        <p className="text-muted-foreground max-w-sm mb-6">{t('employees.emptyDesc')}</p>
                        <Button variant="outline" onClick={() => generateDefaultOwner.mutate()} disabled={generateDefaultOwner.isPending}>
                            <Users className="w-4 h-4 mr-2" />
                            {generateDefaultOwner.isPending ? t('employees.generating') : t('employees.generateOwner')}
                        </Button>
                    </div>
                )}

                {activeEmployees.length > 0 && (
                    <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                        <UITable>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>{t('employees.tableEmployee')}</TableHead>
                                    <TableHead>{t('employees.tableRole')}</TableHead>
                                    <TableHead>{t('employees.tableContact')}</TableHead>
                                    <TableHead className="text-right">{t('employees.tableActions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activeEmployees.map((emp) => (
                                    <TableRow key={emp.id}>
                                        <TableCell>
                                            <div className="font-semibold">{emp.name}</div>
                                            <div className="text-xs text-muted-foreground">PIN: {emp.pin ? '****' : t('employees.pinNotSet')}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={ROLE_COLORS[emp.role] || 'bg-secondary'}>
                                                {ROLE_LABELS[emp.role] || emp.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{emp.phone || '-'}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(emp)}>
                                                <Edit2 className="w-4 h-4 text-muted-foreground hover:text-primary" />
                                            </Button>
                                            {emp.role !== 'owner' && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setEmployeeToDelete(emp.id)}
                                                    disabled={deleteEmployee.isPending && employeeToDelete === emp.id}
                                                >
                                                    <Trash2 className="w-4 h-4 text-destructive/70 hover:text-destructive" />
                                                </Button>
                                            )}
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
                        <DialogTitle>{t('employees.editTitle')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('employees.nameLabel')}</label>
                            <Input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('employees.phoneLabel')}</label>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('employees.pinLabel')}</label>
                                <Input
                                    required
                                    type="password"
                                    maxLength={4}
                                    value={formData.pin}
                                    onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/[^0-9]/g, '') })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('employees.roleLabel')}</label>
                            <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })} disabled={selectedEmployee?.role === 'owner'}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('employees.rolePlaceholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="waiter">{t('employees.roleWaiter').split(' (')[0]}</SelectItem>
                                    <SelectItem value="cashier">{t('employees.roleCashier').split(' (')[0]}</SelectItem>
                                    <SelectItem value="manager">{t('employees.roleManager').split(' (')[0]}</SelectItem>
                                    {selectedEmployee?.role === 'owner' && <SelectItem value="owner">{t('employees.roleOwner')}</SelectItem>}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" className="w-full" disabled={updateEmployee.isPending}>
                            {updateEmployee.isPending ? t('employees.saving') : t('employees.saveChanges')}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete/Disable Confirmation Dialog */}
            <Dialog open={!!employeeToDelete} onOpenChange={(open) => !open && setEmployeeToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('common.confirmAction')}</DialogTitle>
                        <DialogDescription className="mt-2 text-sm text-muted-foreground">
                            {t('employees.confirmDisable') || "Tem certeza que deseja desativar este(a) funcionário(a)? O acesso ao PDV será revogado imediatamente."}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-4 flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setEmployeeToDelete(null)}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={deleteEmployee.isPending}
                            onClick={async () => {
                                if (employeeToDelete) {
                                    try {
                                        await deleteEmployee.mutateAsync(employeeToDelete);
                                        setEmployeeToDelete(null);
                                    } catch (err) {
                                        // Error handled by the hook
                                    }
                                }
                            }}
                        >
                            {deleteEmployee.isPending ? t('common.deleting') || 'Desativando...' : t('common.confirmAction') || 'Desativar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
