import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Store, Users, MessageSquare, AlertTriangle, Loader2, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Admin() {
    const { profile, loading: authLoading } = useAuth();
    const { t } = useLanguage();
    const [stats, setStats] = useState({ restaurants: 0, contacts: 0, campaigns: 0, deletions: 0 });
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (authLoading || !profile || profile.role !== 'super_admin') return;

        const fetchAdminData = async () => {
            try {
                const [
                    { count: restCount, data: restData },
                    { count: contactsCount },
                    { count: campaignsCount },
                    { count: deletionsCount }
                ] = await Promise.all([
                    supabase.from('profiles').select('id, restaurant_name, owner_name, email:user_id, created_at', { count: 'exact' }),
                    supabase.from('contacts').select('*', { count: 'exact', head: true }),
                    supabase.from('campaigns').select('*', { count: 'exact', head: true }),
                    supabase.from('deletion_requests').select('*', { count: 'exact', head: true })
                ]);

                setStats({
                    restaurants: restCount || 0,
                    contacts: contactsCount || 0,
                    campaigns: campaignsCount || 0,
                    deletions: deletionsCount || 0
                });

                if (restData) {
                    // Extra fetch to get email from users would require service_role, so for now we just show what's in profiles
                    setRestaurants(restData);
                }
            } catch (error) {
                console.error('Error fetching admin data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdminData();
    }, [profile, authLoading]);

    // Restrict access
    if (authLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin w-8 h-8" /></div>;
    if (!profile || profile.role !== 'super_admin') return <Navigate to="/dashboard" replace />;

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-80px)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
                        <Store className="mr-3 h-8 w-8 text-primary" />
                        {t('admin.title')}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {t('admin.subtitle')}
                    </p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="shadow-sm border border-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{t('admin.totalRestaurants')}</CardTitle>
                        <Store className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.restaurants}</div>
                        <p className="text-xs text-muted-foreground mt-1 text-green-600 flex items-center">
                            <ArrowUpRight className="h-3 w-3 mr-1" /> {t('admin.registered')}
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border border-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{t('admin.totalContacts')}</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.contacts}</div>
                        <p className="text-xs text-muted-foreground mt-1 text-blue-600">
                            {t('admin.registeredInPlatform')}
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border border-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{t('admin.smsCampaigns')}</CardTitle>
                        <MessageSquare className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.campaigns}</div>
                        <p className="text-xs text-muted-foreground mt-1 text-orange-600">
                            {t('admin.createdByUser')}
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border border-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{t('admin.lgpdDeletions')}</CardTitle>
                        <AlertTriangle className={`h-4 w-4 ${stats.deletions > 0 ? "text-destructive" : "text-muted-foreground"}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.deletions}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {t('admin.pendingRequests')}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-full shadow-sm border border-border">
                    <CardHeader>
                        <CardTitle>{t('admin.registeredRestaurants')}</CardTitle>
                        <CardDescription>
                            {t('admin.restaurantsListDesc')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border border-border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead>{t('admin.tableRestaurant')}</TableHead>
                                        <TableHead>{t('admin.tableOwner')}</TableHead>
                                        <TableHead>{t('admin.tableEntryDate')}</TableHead>
                                        <TableHead className="text-right">{t('admin.tableActions')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {restaurants.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center">
                                                {t('admin.noRestaurantsFound')}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        restaurants.map((restaurant) => (
                                            <TableRow key={restaurant.id} className="hover:bg-muted/30">
                                                <TableCell className="font-medium">{restaurant.restaurant_name || t('admin.unnamedRestaurant')}</TableCell>
                                                <TableCell>{restaurant.owner_name || '-'}</TableCell>
                                                <TableCell>
                                                    {new Date(restaurant.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm">
                                                        {t('admin.actionView')}
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
            </div>
        </div>
    );
}
