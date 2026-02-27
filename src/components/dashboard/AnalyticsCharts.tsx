import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

interface AnalyticsChartsProps {
    data: {
        sentTrend: any[];
        campaignsByType: { type: string; count: number }[];
    };
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
    const { t } = useLanguage();

    const TYPE_LABELS: Record<string, string> = {
        sms: t('analytics.type.sms'),
        email: t('analytics.type.email'),
        whatsapp: t('analytics.type.whatsapp')
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trend Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('analytics.sendTrend')}</CardTitle>
                    <CardDescription>
                        {t('analytics.sentVsDelivered')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={data.sentTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="sent"
                                stroke="#8884d8"
                                name={t('analytics.sent.chart')}
                                strokeWidth={2}
                            />
                            <Line
                                type="monotone"
                                dataKey="delivered"
                                stroke="#82ca9d"
                                name={t('analytics.delivered.chart')}
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Campaign Types Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('analytics.campaignTypes')}</CardTitle>
                    <CardDescription>
                        {t('analytics.distributionByType')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={data.campaignsByType}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ type, percent }) =>
                                    `${TYPE_LABELS[type] || type} ${(percent * 100).toFixed(0)}%`
                                }
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                            >
                                {data.campaignsByType.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
