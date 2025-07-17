import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Calendar,
  QrCode,
  BarChart3,
  Target,
  Gift
} from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { title: 'Contacts collectés', value: '2,847', change: '+12%', icon: Users },
    { title: 'Campagnes actives', value: '3', change: '+2', icon: MessageSquare },
    { title: 'Taux de réponse', value: '23%', change: '+5%', icon: TrendingUp },
    { title: 'Revenus générés', value: '€1,240', change: '+€340', icon: Target },
  ];

  const recentCampaigns = [
    { name: 'Lundi Boost', status: 'active', responses: 45, revenue: '€230' },
    { name: 'Happy Hour Mardi', status: 'completed', responses: 67, revenue: '€450' },
    { name: 'Weekend Special', status: 'draft', responses: 0, revenue: '€0' },
  ];

  const quickActions = [
    { title: 'Créer QR Code', description: 'Générer un nouveau QR code', icon: QrCode },
    { title: 'Nouvelle campagne', description: 'Lancer une promotion', icon: MessageSquare },
    { title: 'Analytics', description: 'Voir les statistiques', icon: BarChart3 },
    { title: 'Programme parrainage', description: 'Gérer les récompenses', icon: Gift },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Bienvenue sur votre tableau de bord RestauBoost
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-primary">
                  {stat.change} par rapport au mois dernier
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle>Campagnes récentes</CardTitle>
            <CardDescription>
              Aperçu de vos dernières campagnes marketing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCampaigns.map((campaign, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {campaign.responses} réponses • {campaign.revenue}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      campaign.status === 'active' ? 'default' : 
                      campaign.status === 'completed' ? 'secondary' : 'outline'
                    }
                  >
                    {campaign.status === 'active' ? 'Actif' : 
                     campaign.status === 'completed' ? 'Terminé' : 'Brouillon'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>
              Raccourcis vers les fonctionnalités principales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button 
                    key={index} 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                  >
                    <Icon className="h-6 w-6" />
                    <div className="text-center">
                      <p className="font-medium text-sm">{action.title}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <CardDescription>
            Les dernières interactions avec vos clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: 'Il y a 5 min', action: 'Nouveau contact collecté', detail: 'Marie D. - Table 12' },
              { time: 'Il y a 1h', action: 'Campagne envoyée', detail: '45 messages WhatsApp - Lundi Boost' },
              { time: 'Il y a 2h', action: 'Parrainage réussi', detail: 'Client recommandé par Pierre M.' },
              { time: 'Il y a 4h', action: 'Avis client reçu', detail: '5 étoiles - Service excellent' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border-l-2 border-primary/20">
                <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="font-medium text-sm">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.detail}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}