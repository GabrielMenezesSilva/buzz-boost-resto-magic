import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus, Send, Calendar, MessageSquare, BarChart3, Clock, Users, Edit, Trash2, Loader2 } from 'lucide-react';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useToast } from '@/hooks/use-toast';

interface CampaignListProps {
    onCreateClick: () => void;
}

export default function CampaignList({ onCreateClick }: CampaignListProps) {
    const { t } = useLanguage();
    const { toast } = useToast();
    const { campaigns, isLoading, sendCampaign, deleteCampaign } = useCampaigns();

    const handleSendCampaign = async (campaignId: string) => {
        try {
            await sendCampaign(campaignId);
            toast({
                title: t('campaigns.success'),
                description: t('campaigns.campaignSent'),
            });
        } catch (error) {
            console.error('Error sending campaign:', error);
            toast({
                title: t('campaigns.error'),
                description: error instanceof Error ? error.message : t('campaigns.cannotSend'),
                variant: "destructive",
            });
        }
    };

    const handleDeleteCampaign = async (campaignId: string) => {
        try {
            await deleteCampaign(campaignId);
            toast({
                title: t('campaigns.success'),
                description: t('campaigns.campaignDeleted'),
            });
        } catch (error) {
            toast({
                title: t('campaigns.error'),
                description: t('campaigns.cannotDelete'),
                variant: "destructive",
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('campaigns.myCampaigns')}</CardTitle>
                <CardDescription>
                    {t('campaigns.manageAndTrack')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : campaigns.length === 0 ? (
                    <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">{t('campaigns.noCampaigns')}</h3>
                        <p className="text-muted-foreground mb-4">
                            {t('campaigns.createFirstCampaign')}
                        </p>
                        <Button
                            onClick={onCreateClick}
                            className="bg-gradient-primary shadow-warm"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            {t('campaigns.createACampaign')}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {campaigns.map((campaign) => (
                            <div key={campaign.id} className="border rounded-lg p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-lg font-semibold">{campaign.name}</h3>
                                            <Badge
                                                variant={
                                                    campaign.status === 'active' || campaign.status === 'sent' ? 'default' : 'outline'
                                                }
                                            >
                                                {campaign.status === 'active' ? t('campaigns.status.active') :
                                                    campaign.status === 'sent' ? t('campaigns.status.sent') :
                                                        campaign.status === 'scheduled' ? t('campaigns.status.scheduled') : t('campaigns.status.draft')}
                                            </Badge>
                                            <Badge variant="secondary" className="text-xs">
                                                {campaign.campaign_type.toUpperCase()}
                                            </Badge>
                                        </div>
                                        <p className="text-muted-foreground mb-2">{campaign.message}</p>
                                        {campaign.scheduled_at && (
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Clock className="w-4 h-4 mr-1" />
                                                {t('campaigns.scheduledFor')} {new Date(campaign.scheduled_at).toLocaleString('pt-BR')}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex space-x-2">
                                        {campaign.status === 'draft' && (
                                            <Button
                                                variant="default"
                                                size="sm"
                                                onClick={() => handleSendCampaign(campaign.id)}
                                                className="bg-gradient-primary shadow-warm"
                                            >
                                                <Send className="w-4 h-4 mr-1" />
                                                {t('campaigns.send')}
                                            </Button>
                                        )}
                                        <Button variant="outline" size="sm">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDeleteCampaign(campaign.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <Send className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">{campaign.total_recipients || 0}</p>
                                            <p className="text-xs text-muted-foreground">{t('campaigns.totalSent')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Users className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">{campaign.successful_sends || 0}</p>
                                            <p className="text-xs text-muted-foreground">{t('campaigns.success')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <BarChart3 className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">{campaign.failed_sends || 0}</p>
                                            <p className="text-xs text-muted-foreground">{t('campaigns.failures')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">
                                                {campaign.sent_at ? new Date(campaign.sent_at).toLocaleDateString('pt-BR') : '-'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{t('campaigns.sentOn')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
