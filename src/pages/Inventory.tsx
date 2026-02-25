import { useState } from 'react';
import { useInventoryAlerts } from '@/hooks/useInventoryAlerts';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Archive, AlertTriangle, CalendarRange } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Inventory() {
    const { t } = useLanguage();
    const { alerts, isLoading } = useInventoryAlerts();

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;

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
