import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useTemplates } from '@/hooks/useTemplates';
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
  Trash2,
  Loader2
} from 'lucide-react';

export default function Campaigns() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    campaign_type: 'sms',
    scheduled_at: '',
    zapier_webhook_url: '',
    filters: {}
  });
  
  const { toast } = useToast();
  const { 
    campaigns, 
    stats, 
    isLoading, 
    createCampaign, 
    updateCampaign, 
    deleteCampaign, 
    sendCampaign 
  } = useCampaigns();

  const { 
    templates, 
    replaceVariables,
    getTemplatesByCategory 
  } = useTemplates();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalMessage = formData.message;
    
    // If using a template, replace variables
    if (selectedTemplate && Object.keys(templateVariables).length > 0) {
      finalMessage = replaceVariables(formData.message, templateVariables);
    }
    
    if (!formData.name || !finalMessage) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    // Validate Zapier webhook for SMS/WhatsApp
    if ((formData.campaign_type === 'sms' || formData.campaign_type === 'whatsapp') && !formData.zapier_webhook_url) {
      toast({
        title: "Webhook Zapier requis",
        description: `Pour les campagnes ${formData.campaign_type.toUpperCase()}, vous devez configurer un webhook Zapier`,
        variant: "destructive",
      });
      return;
    }

    try {
      await createCampaign({
        ...formData,
        message: finalMessage
      });
      setShowCreateForm(false);
      resetForm();
      toast({
        title: "Succès",
        description: "Campagne créée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la campagne",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      message: '',
      campaign_type: 'sms',
      scheduled_at: '',
      zapier_webhook_url: '',
      filters: {}
    });
    setSelectedTemplate('');
    setTemplateVariables({});
  };

  const handleTemplateSelect = (templateId: string) => {
    if (templateId === 'none') {
      // Reset to empty form
      setSelectedTemplate('');
      setFormData({
        ...formData,
        name: '',
        message: ''
      });
      setTemplateVariables({});
      return;
    }
    
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setFormData({
        ...formData,
        name: template.name,
        message: template.message
      });
      
      // Initialize template variables
      const initialVariables: Record<string, string> = {};
      template.variables.forEach(variable => {
        initialVariables[variable] = '';
      });
      setTemplateVariables(initialVariables);
    }
  };

  const handleVariableChange = (variable: string, value: string) => {
    setTemplateVariables(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  const handleSendCampaign = async (campaignId: string) => {
    try {
      await sendCampaign(campaignId);
      toast({
        title: "Succès",
        description: "Campagne envoyée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la campagne",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      await deleteCampaign(campaignId);
      toast({
        title: "Succès",
        description: "Campagne supprimée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la campagne",
        variant: "destructive",
      });
    }
  };

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
                  onClick={() => {
                    setShowCreateForm(!showCreateForm);
                    if (showCreateForm) resetForm();
                  }}
                  className="bg-gradient-primary shadow-warm"
                >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle campagne
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Template Selection */}
              <div className="space-y-2">
                <Label htmlFor="templateSelect">Utiliser un template (optionnel)</Label>
                <Select 
                  value={selectedTemplate} 
                  onValueChange={handleTemplateSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un template existant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Créer depuis zéro</SelectItem>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} ({template.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTemplate && (
                  <p className="text-sm text-muted-foreground">
                    Template sélectionné. Vous pouvez modifier le message ci-dessous.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="campaignName">Nom de la campagne</Label>
                  <Input
                    id="campaignName"
                    placeholder="Ex: Lundi Boost"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaignType">Type de campagne</Label>
                  <Select 
                    value={formData.campaign_type} 
                    onValueChange={(value) => setFormData({...formData, campaign_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Template Variables */}
              {selectedTemplate && Object.keys(templateVariables).length > 0 && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <Label className="text-sm font-medium">Variables du template</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(templateVariables).map(([variable, value]) => (
                      <div key={variable} className="space-y-2">
                        <Label htmlFor={`var-${variable}`} className="text-sm">
                          {'{'}{'{'}{variable}{'}'}{'}'} 
                        </Label>
                        <Input
                          id={`var-${variable}`}
                          placeholder={`Valeur pour ${variable}`}
                          value={value}
                          onChange={(e) => handleVariableChange(variable, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Ces variables seront remplacées dans le message final.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="message">Message promotionnel</Label>
                <Textarea
                  id="message"
                  placeholder="Rédigez votre message promotionnel..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formData.message.length}/160 caractères pour SMS</span>
                  {selectedTemplate && Object.keys(templateVariables).length > 0 && (
                    <span className="text-primary">Aperçu avec variables appliquées ci-dessous</span>
                  )}
                </div>
                
                {/* Message Preview */}
                {selectedTemplate && Object.keys(templateVariables).length > 0 && (
                  <div className="p-3 bg-muted rounded-md border">
                    <Label className="text-xs text-muted-foreground">Aperçu du message final:</Label>
                    <p className="text-sm mt-1">
                      {replaceVariables(formData.message, templateVariables)}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Date et heure d'envoi (optionnel)</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={formData.scheduled_at}
                  onChange={(e) => setFormData({...formData, scheduled_at: e.target.value})}
                />
                <p className="text-sm text-muted-foreground">
                  Laissez vide pour envoyer immédiatement
                </p>
              </div>

              {/* Zapier Webhook URL for SMS/WhatsApp */}
              {(formData.campaign_type === 'sms' || formData.campaign_type === 'whatsapp') && (
                <div className="space-y-2 p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                  <Label htmlFor="zapierWebhook">URL Webhook Zapier</Label>
                  <Input
                    id="zapierWebhook"
                    placeholder="https://hooks.zapier.com/hooks/catch/..."
                    value={formData.zapier_webhook_url}
                    onChange={(e) => setFormData({...formData, zapier_webhook_url: e.target.value})}
                  />
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>📋 <strong>Como configurar:</strong></p>
                    <p>1. Crie um Zap no Zapier com um trigger "Webhooks"</p>
                    <p>2. Cole a URL do webhook aqui</p>
                    <p>3. Configure o Zap para enviar {formData.campaign_type === 'sms' ? 'SMS' : 'WhatsApp'}</p>
                    <p className="text-primary font-medium">⚡ 100 zaps/mês grátis no Zapier!</p>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <Button 
                  type="submit" 
                  className="bg-gradient-primary shadow-warm"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Créer la campagne
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    resetForm();
                  }}
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
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune campagne</h3>
              <p className="text-muted-foreground mb-4">
                Créez votre première campagne pour commencer à engager vos clients.
              </p>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-primary shadow-warm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer une campagne
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
                          {campaign.status === 'active' ? 'Actif' : 
                           campaign.status === 'sent' ? 'Envoyé' : 
                           campaign.status === 'scheduled' ? 'Programmé' : 'Brouillon'}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {campaign.campaign_type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{campaign.message}</p>
                      {campaign.scheduled_at && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          Programmé pour {new Date(campaign.scheduled_at).toLocaleString('fr-FR')}
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
                          Envoyer
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
                        <p className="text-xs text-muted-foreground">Total envoyés</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{campaign.successful_sends || 0}</p>
                        <p className="text-xs text-muted-foreground">Succès</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{campaign.failed_sends || 0}</p>
                        <p className="text-xs text-muted-foreground">Échecs</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {campaign.sent_at ? new Date(campaign.sent_at).toLocaleDateString('fr-FR') : '-'}
                        </p>
                        <p className="text-xs text-muted-foreground">Envoyé le</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}