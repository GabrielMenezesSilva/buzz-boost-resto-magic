import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, MessageSquare, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AnalyticsRecentActivityProps {
    recentActivity: Array<{
        id: string;
        type: 'campaign' | 'contact';
        description: string;
        date: string;
    }>;
}

export function AnalyticsRecentActivity({ recentActivity }: AnalyticsRecentActivityProps) {
    const { t } = useLanguage();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('analytics.recentActivity')}</CardTitle>
                <CardDescription>
                    {t('analytics.lastActions')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {recentActivity.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                        <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>{t('analytics.noRecentActivity')}</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentActivity.slice(0, 3).map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                    {activity.type === 'campaign' ? (
                                        <MessageSquare className="h-4 w-4 text-blue-600" />
                                    ) : (
                                        <Users className="h-4 w-4 text-green-600" />
                                    )}
                                    <div>
                                        <p className="text-sm font-medium">{activity.description}</p>
                                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                                    </div>
                                </div>
                                <Badge variant={activity.type === 'campaign' ? 'default' : 'secondary'} className="text-xs">
                                    {activity.type === 'campaign' ? t('analytics.campaign.label') : t('analytics.contact.label')}
                                </Badge>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
