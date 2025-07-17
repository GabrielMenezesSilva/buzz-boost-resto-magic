import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Send, 
  Calendar,
  MessageSquare,
  Target,
  BarChart3,
  Clock,
  Users,
  Edit,
  Trash2
} from 'lucide-react';

export default function Campaigns() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const campaigns = [
    {
      id: 1,
      name: 'Lundi Boost',
      message: 'Uniquement aujourd\'hui : bières en double ! 🍺',
      schedule: 'Tous les lundis à 11h',
      status: 'active',
      sent: 124,
      responses: 45,
      revenue: 230,
      nextSend: '2024-01-22'
    },
    {
      id: 2,
      name: 'Happy Hour Mardi',
      message: 'Happy Hour jusqu\'à 19h - Cocktails à -50% ! 🍹',
      schedule: 'Tous les mardis à 16h',
      status: 'active',
      sent: 156,
      responses: 67,
      revenue: 450,
      nextSend: '2024-01-23'
    },
    {
      id: 3,
      name: 'Weekend Special',
      message: 'Menu famille à 39€ ce weekend !',
      schedule: 'Vendredis à 18h',
      status: 'draft',
      sent: 0,
      responses: 0,
      revenue: 0,
      nextSend: '2024-01-26'
    }
  ];

  const stats = [
    { title: 'Campagnes actives', value: '2', icon: MessageSquare },
    { title: 'Messages envoyés', value: '280', icon: Send },
    { title: 'Taux de réponse', value: '23%', icon: Target },
    { title: 'Revenus générés', value: '€680', icon: BarChart3 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Campagnes</h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos campagnes de marketing automatisées
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-gradient-primary shadow-warm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle campagne
        </Button>
      </div>

      {/* Stats */}
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
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Campaign Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Créer une nouvelle campagne</CardTitle>
            <CardDescription>
              Configurez votre campagne de promotion automatisée
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="campaignName">Nom de la campagne</Label>
                  <Input
                    id="campaignName"
                    placeholder="Ex: Lundi Boost"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dayOfWeek">Jour de la semaine</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un jour" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">Lundi</SelectItem>
                      <SelectItem value="tuesday">Mardi</SelectItem>
                      <SelectItem value="wednesday">Mercredi</SelectItem>
                      <SelectItem value="thursday">Jeudi</SelectItem>
                      <SelectItem value="friday">Vendredi</SelectItem>
                      <SelectItem value="saturday">Samedi</SelectItem>
                      <SelectItem value="sunday">Dimanche</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message promotionnel</Label>
                <Textarea
                  id="message"
                  placeholder="Rédigez votre message promotionnel..."
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">
                  Maximum 160 caractères pour SMS
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sendTime">Heure d'envoi</Label>
                  <Input
                    id="sendTime"
                    type="time"
                    defaultValue="11:00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetGroup">Groupe cible</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les contacts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les contacts</SelectItem>
                      <SelectItem value="active">Clients actifs</SelectItem>
                      <SelectItem value="inactive">Clients inactifs</SelectItem>
                      <SelectItem value="new">Nouveaux clients</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="bg-gradient-primary shadow-warm">
                  Créer la campagne
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Campaigns List */}
      <Card>
        <CardHeader>
          <CardTitle>Mes campagnes</CardTitle>
          <CardDescription>
            Gérez et suivez vos campagnes marketing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{campaign.name}</h3>
                      <Badge 
                        variant={
                          campaign.status === 'active' ? 'default' : 'outline'
                        }
                      >
                        {campaign.status === 'active' ? 'Actif' : 'Brouillon'}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">{campaign.message}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      {campaign.schedule}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Send className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{campaign.sent}</p>
                      <p className="text-xs text-muted-foreground">Envoyés</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{campaign.responses}</p>
                      <p className="text-xs text-muted-foreground">Réponses</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">€{campaign.revenue}</p>
                      <p className="text-xs text-muted-foreground">Revenus</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(campaign.nextSend).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-xs text-muted-foreground">Prochain envoi</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}