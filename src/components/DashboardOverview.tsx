import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDashboardData } from '@/hooks/useDashboardData';
import QRGenerator from '@/components/QRGenerator';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Calendar,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  QrCode,
  Plus
} from 'lucide-react';

export default function DashboardOverview() {
  const { t } = useLanguage();
  const { stats, recentContacts, recentCampaigns, loading, refetch } = useDashboardData();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t('dashboard.overviewTitle')}</h2>
          <p className="text-muted-foreground">
            {t('dashboard.overviewSubtitle')}
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/qr">
            <Button variant="outline" size="sm">
              {t('dashboard.scanQr')}
            </Button>
          </Link>
          <Link to="/campaigns">
            <Button size="sm" className="bg-gradient-primary shadow-warm">
              {t('dashboard.newCampaign')}
            </Button>
          </Link>
        </div>
      </div>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalContacts')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContacts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.recentContacts > 0 && `+${stats.recentContacts} ${t('dashboard.thisWeek')}`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.activeCampaigns')}</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalCampaigns} {t('dashboard.total')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.conversionRate')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85.5%</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.last30Days')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.uniqueQr')}</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ABC123</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.yourAccessCode')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recentCampaigns')}</CardTitle>
            <CardDescription>
              {t('dashboard.recentCampaignsDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentCampaigns.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t('dashboard.noCampaignsYet')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCampaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{campaign.name}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(campaign.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {campaign.status === 'completed' && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      {campaign.status === 'sending' && (
                        <Clock className="h-4 w-4 text-blue-600" />
                      )}
                      {campaign.status === 'failed' && (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-xs capitalize">{campaign.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Contacts */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recentContacts')}</CardTitle>
            <CardDescription>
              {t('dashboard.recentContactsDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentContacts.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t('dashboard.noContactsYet')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{contact.name}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{contact.phone}</span>
                        {contact.source && (
                          <>
                            <span>•</span>
                            <span>{contact.source}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(contact.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* QR Code Generator */}
      <QRGenerator />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.quickActions')}</CardTitle>
          <CardDescription>
            {t('dashboard.quickActionsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/qr" className="block">
              <div className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer text-center">
                <QrCode className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium mb-1">{t('dashboard.captureContact')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.captureContactDesc')}
                </p>
              </div>
            </Link>

            <Link to="/campaigns" className="block">
              <div className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer text-center">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium mb-1">{t('dashboard.newCampaignAction')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.newCampaignDesc')}
                </p>
              </div>
            </Link>

            <Link to="/contacts" className="block">
              <div className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium mb-1">{t('dashboard.manageContacts')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.manageContactsDesc')}
                </p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}