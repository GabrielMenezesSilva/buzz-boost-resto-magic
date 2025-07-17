import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/hooks/useDashboardData";
import QRGenerator from "@/components/QRGenerator";
import { Link } from "react-router-dom";
import {
  Users,
  MessageSquare,
  TrendingUp,
  Calendar,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  QrCode
} from "lucide-react";

const Dashboard = () => {
  const { stats, recentContacts, recentCampaigns, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'sending':
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'sending':
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Visão geral do seu RestauBoost
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/qr">
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Escanear QR
              </Button>
            </Link>
            <Link to="/campaigns">
              <Button className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Nova Campanha
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Contatos
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalContacts}</div>
              <p className="text-xs text-muted-foreground">
                {stats.recentContacts} novos esta semana
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Campanhas Criadas
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
              <p className="text-xs text-muted-foreground">
                Total de campanhas
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Campanhas Ativas
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCampaigns}</div>
              <p className="text-xs text-muted-foreground">
                Em andamento
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taxa de Crescimento
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalContacts > 0 ? `+${Math.round((stats.recentContacts / stats.totalContacts) * 100)}%` : '0%'}
              </div>
              <p className="text-xs text-muted-foreground">
                Esta semana
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Contacts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Contatos Recentes
              </CardTitle>
              <Link to="/contacts">
                <Button variant="ghost" size="sm">
                  Ver todos
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentContacts.length > 0 ? (
                <div className="space-y-4">
                  {recentContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            <span>{contact.phone}</span>
                            {contact.email && (
                              <>
                                <Mail className="w-3 h-3 ml-2" />
                                <span>{contact.email}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="text-xs">
                          {contact.source === 'qr_scan' ? 'QR Code' : contact.source}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(contact.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum contato ainda</p>
                  <Link to="/qr">
                    <Button variant="outline" size="sm" className="mt-2">
                      Escanear primeiro QR
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Campaigns */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Campanhas Recentes
              </CardTitle>
              <Link to="/campaigns">
                <Button variant="ghost" size="sm">
                  Ver todas
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentCampaigns.length > 0 ? (
                <div className="space-y-4">
                  {recentCampaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            {getStatusIcon(campaign.status)}
                            <span className="capitalize">{campaign.campaign_type}</span>
                            <span>•</span>
                            <span>{campaign.total_recipients} destinatários</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`text-xs ${getStatusColor(campaign.status)}`}>
                          {campaign.status === 'draft' ? 'Rascunho' :
                           campaign.status === 'scheduled' ? 'Agendada' :
                           campaign.status === 'sending' ? 'Enviando' :
                           campaign.status === 'sent' ? 'Enviada' :
                           campaign.status === 'completed' ? 'Concluída' : campaign.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(campaign.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhuma campanha criada</p>
                  <Link to="/campaigns">
                    <Button variant="outline" size="sm" className="mt-2">
                      Criar primeira campanha
                    </Button>
                  </Link>
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
            <CardTitle className="text-lg font-semibold">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/qr" className="block">
                <div className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer text-center">
                  <Plus className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium mb-1">Capturar Contato</h3>
                  <p className="text-sm text-muted-foreground">
                    Escaneie QR code para adicionar novo cliente
                  </p>
                </div>
              </Link>

              <Link to="/campaigns" className="block">
                <div className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer text-center">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium mb-1">Nova Campanha</h3>
                  <p className="text-sm text-muted-foreground">
                    Crie campanha de SMS/WhatsApp
                  </p>
                </div>
              </Link>

              <Link to="/contacts" className="block">
                <div className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium mb-1">Gerenciar Contatos</h3>
                  <p className="text-sm text-muted-foreground">
                    Visualize e organize sua base de clientes
                  </p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;