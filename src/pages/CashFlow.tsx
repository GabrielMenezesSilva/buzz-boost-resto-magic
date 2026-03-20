import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCashFlow, CashFlowEntryInsert } from "@/hooks/useCashFlow";
import { useExpenseCategories } from "@/hooks/useExpenseCategories";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ArrowDownCircle, ArrowUpCircle, Wallet, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/currency";

export default function CashFlow() {
    const { t, language } = useLanguage();
    const { entries, addEntry, deleteEntry, isLoading, error } = useCashFlow();


    const { categories } = useExpenseCategories();

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [formData, setFormData] = useState<CashFlowEntryInsert>({
        type: 'expense',
        amount: 0,
        description: '',
        entry_date: format(new Date(), 'yyyy-MM-dd'),
        payment_method: 'other',
        category_id: null,
        reference_id: null,
        reference_type: 'manual',
        is_recurring: false
    });

    if (error) {
        return (
            <div className="container mx-auto p-4 md:p-8 md:pt-24 min-h-screen">
                <div className="max-w-2xl mx-auto p-6 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-center mt-8">
                    <Wallet className="w-12 h-12 mx-auto mb-4 opacity-80" />
                    <h2 className="text-2xl font-bold mb-2">{t("cashflow.errorTitle")}</h2>
                    <p className="mb-4">{t("cashflow.errorDesc1")}</p>
                    <p className="text-sm opacity-90 mb-6">{t("cashflow.errorDesc2")}</p>
                </div>
            </div>
        );
    }

    const incomeTotal = entries.filter(e => e.type === 'income').reduce((acc, e) => acc + Number(e.amount), 0);
    const expenseTotal = entries.filter(e => e.type === 'expense').reduce((acc, e) => acc + Number(e.amount), 0);
    const balance = incomeTotal - expenseTotal;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addEntry.mutateAsync(formData);
            setIsAddOpen(false);
            setFormData({
                type: 'expense',
                amount: 0,
                description: '',
                entry_date: format(new Date(), 'yyyy-MM-dd'),
                payment_method: 'other',
                category_id: null,
                reference_id: null,
                reference_type: 'manual',
                is_recurring: false
            });
        } catch (err) {
            console.error(err);
        }
    };

    const renderMetrics = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-card to-card/50 border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{t("cashflow.income")}</CardTitle>
                    <ArrowUpCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(incomeTotal)}
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-card to-card/50 border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{t("cashflow.expense")}</CardTitle>
                    <ArrowDownCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                        {formatCurrency(expenseTotal)}
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-primary">{t("cashflow.balance")}</CardTitle>
                    <Wallet className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${balance >= 0 ? 'text-primary' : 'text-red-500'}`}>
                        {formatCurrency(balance)}
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderHistoryContent = () => {
        if (isLoading) {
            return <div className="py-8 text-center text-muted-foreground">{t("common.loading")}</div>;
        }

        if (entries.length === 0) {
            return (
                <div className="py-12 text-center flex flex-col items-center">
                    <Wallet className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                    <p className="text-muted-foreground">{t("cashflow.empty")}</p>
                </div>
            );
        }

        return (
            <div className="rounded-md border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead>{t("cashflow.colDate")}</TableHead>
                            <TableHead>{t("cashflow.colDescription")}</TableHead>
                            <TableHead>{t("cashflow.colCategory")}</TableHead>
                            <TableHead className="text-right">{t("cashflow.colAmount")}</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {entries.map((entry) => (
                            <TableRow key={entry.id}>
                                <TableCell className="font-medium">
                                    {format(new Date(entry.entry_date), 'dd/MM/yyyy')}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{entry.description}</span>
                                        {entry.reference_type === 'order' && (
                                            <span className="text-xs text-muted-foreground">{t("cashflow.orderRef")}{entry.reference_id?.split('-')[0]}</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {entry.category ? (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${entry.category.color}20`, color: entry.category.color || 'inherit' }}>
                                            {entry.category.name}
                                        </span>
                                    ) : <span className="text-muted-foreground text-xs">-</span>}
                                </TableCell>
                                <TableCell className={`text-right font-semibold ${entry.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                                    {entry.type === 'income' ? '+' : '-'} {formatCurrency(Number(entry.amount))}
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => {
                                        if (window.confirm(t("common.confirmAction"))) {
                                            deleteEntry.mutate(entry.id);
                                        }
                                    }}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4 md:p-8 md:pt-24 min-h-screen">
            {/* Same header as before (lines 76-167 basically intact) */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t("cashflow.title")}</h1>
                    <p className="text-muted-foreground">{t("cashflow.subtitle")}</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            {t("cashflow.newEntry")}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t("cashflow.addEntry")}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>{t("cashflow.typeLabel")}</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(val: 'income' | 'expense') => setFormData(prev => ({ ...prev, type: val }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="income">{t("cashflow.typeIncome")}</SelectItem>
                                            <SelectItem value="expense">{t("cashflow.typeExpense")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>{t("cashflow.date")}</Label>
                                    <Input
                                        type="date"
                                        required
                                        value={formData.entry_date}
                                        onChange={(e) => setFormData(prev => ({ ...prev, entry_date: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>{t("cashflow.description")}</Label>
                                <Input
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder={t("cashflow.descPlaceholder")}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>{t("cashflow.amount")}</Label>
                                    <Input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t("cashflow.category")}</Label>
                                    <Select
                                        value={formData.category_id || "none"}
                                        onValueChange={(val) => setFormData(prev => ({ ...prev, category_id: val === "none" ? null : val }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("common.loading")?.replace('...', '') || "Selecione..."} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">{t("cashflow.noCategory") || "Sem Categoria"}</SelectItem>
                                            {categories.filter(c => c.type === formData.type).map(cat => (
                                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={addEntry.isPending}>
                                {addEntry.isPending ? t("cashflow.saving") : t("cashflow.save")}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {renderMetrics()}

            <Card>
                <CardHeader>
                    <CardTitle>{t("cashflow.historyTitle")}</CardTitle>
                    <CardDescription>{t("cashflow.historyDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                    {renderHistoryContent()}
                </CardContent>
            </Card>
        </div>
    );
}
