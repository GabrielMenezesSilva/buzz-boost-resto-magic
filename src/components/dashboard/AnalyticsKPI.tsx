import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MessageSquare, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AnalyticsKPIProps {
    data: {
        totalCampaigns: number;
        totalSent: number;
        successRate: number;
        totalContacts: number;
        totalCost: number;
    };
    formatPercentage: (value: number) => string;
    formatCurrency: (value: number) => string;
}

export function AnalyticsKPI({ data, formatPercentage, formatCurrency }: AnalyticsKPIProps) {
    const { t } = useLanguage();

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('analytics.campaigns')}</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.totalCampaigns}</div>
                        <p className="text-xs text-muted-foreground">
                            {t('analytics.inPeriod')}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('analytics.sent')}</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.totalSent}</div>
                        <p className="text-xs text-muted-foreground">
                            {formatPercentage(data.successRate)} {t('analytics.success')}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('analytics.contacts')}</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.totalContacts}</div>
                        <p className="text-xs text-muted-foreground">
                            {t('analytics.newContacts')}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('analytics.cost')}</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(data.totalCost)}</div>
                        <p className="text-xs text-muted-foreground">
                            {t('analytics.totalCost')}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('analytics.performanceMetrics')}</CardTitle>
                    <CardDescription>
                        {t('analytics.keySuccessIndicators')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">
                                {formatPercentage(data.successRate)}
                            </div>
                            <p className="text-sm text-muted-foreground">{t('analytics.deliveryRate')}</p>
                        </div>

                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">
                                {data.totalSent > 0 ? (data.totalCost / data.totalSent).toFixed(4) : '0.0000'}
                            </div>
                            <p className="text-sm text-muted-foreground">{t('analytics.costPerMessage')}</p>
                        </div>

                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">
                                {data.totalContacts > 0 ? (data.totalSent / data.totalContacts).toFixed(1) : '0.0'}
                            </div>
                            <p className="text-sm text-muted-foreground">{t('analytics.messagesPerContact')}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
