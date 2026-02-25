import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const { t } = useLanguage();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    campaign_type: 'sms',
    scheduled_at: '',
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
        title: t('campaigns.error'),
        description: t('campaigns.fillRequiredFields'),
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
        title: t('campaigns.success'),
        description: t('campaigns.campaignCreated'),
      });
    } catch (error) {
      toast({
        title: t('campaigns.error'),
        description: t('campaigns.cannotCreate'),
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('campaigns.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('campaigns.subtitle')}
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
          {t('campaigns.newCampaign')}
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
            <CardTitle>{t('campaigns.createNew')}</CardTitle>
            <CardDescription>
              {t('campaigns.configurePromo')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Template Selection */}
              <div className="space-y-2">
                <Label htmlFor="templateSelect">{t('campaigns.useTemplate')}</Label>
                <Select 
                  value={selectedTemplate} 
                  onValueChange={handleTemplateSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('campaigns.chooseTemplate')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t('campaigns.createFromScratch')}</SelectItem>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} ({template.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTemplate && (
                  <p className="text-sm text-muted-foreground">
                    {t('campaigns.templateSelected')}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="campaignName">{t('campaigns.campaignName')}</Label>
                  <Input
                    id="campaignName"
                    placeholder={t('campaigns.campaignNamePlaceholder')}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaignType">{t('campaigns.campaignType')}</Label>
                  <Select 
                    value={formData.campaign_type} 
                    onValueChange={(value) => setFormData({...formData, campaign_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('campaigns.selectType')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">{t('campaigns.sms')}</SelectItem>
                      <SelectItem value="whatsapp">{t('campaigns.whatsapp')}</SelectItem>
                      <SelectItem value="email">{t('campaigns.email')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Template Variables */}
              {selectedTemplate && Object.keys(templateVariables).length > 0 && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <Label className="text-sm font-medium">{t('campaigns.templateVariables')}</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(templateVariables).map(([variable, value]) => (
                      <div key={variable} className="space-y-2">
                        <Label htmlFor={`var-${variable}`} className="text-sm">
                          {'{'}{'{'}{variable}{'}'}{'}'} 
                        </Label>
                        <Input
                          id={`var-${variable}`}
                          placeholder={`${t('campaigns.variableValue')} ${variable}`}
                          value={value}
                          onChange={(e) => handleVariableChange(variable, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('campaigns.variablesReplaced')}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="message">{t('campaigns.promoMessage')}</Label>
                <Textarea
                  id="message"
                  placeholder={t('campaigns.promoPlaceholder')}
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formData.message.length}/160 {t('campaigns.charactersForSms')}</span>
                  {selectedTemplate && Object.keys(templateVariables).length > 0 && (
                    <span className="text-primary">{t('campaigns.previewWithVariables')}</span>
                  )}
                </div>
                
                {/* Message Preview */}
                {selectedTemplate && Object.keys(templateVariables).length > 0 && (
                  <div className="p-3 bg-muted rounded-md border">
                    <Label className="text-xs text-muted-foreground">{t('campaigns.finalMessagePreview')}</Label>
                    <p className="text-sm mt-1">
                      {replaceVariables(formData.message, templateVariables)}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledAt">{t('campaigns.sendDateTime')}</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={formData.scheduled_at}
                  onChange={(e) => setFormData({...formData, scheduled_at: e.target.value})}
                />
                <p className="text-sm text-muted-foreground">
                  {t('campaigns.leaveEmptyImmediate')}
                </p>
              </div>

              {/* Twilio Configuration Info */}
              {(formData.campaign_type === 'sms' || formData.campaign_type === 'whatsapp') && (
                <div className="space-y-2 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <div className="flex items-center space-x-2">
                    <div className="text-lg">📱</div>
                    <Label className="font-medium">{t('campaigns.sendingViaTwilio')}</Label>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>✅ {t('campaigns.twilioConfigured')}</p>
                    <p>📧 {t('campaigns.messagesWillBeSent')} {formData.campaign_type === 'sms' ? 'SMS' : 'WhatsApp'} {t('campaigns.sentDirectly')}</p>
                    <p className="text-primary font-medium">🔧 {t('campaigns.twilioApiConfigured')}</p>
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
                      {t('campaigns.creating')}
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      {t('campaigns.createCampaign')}
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
                  {t('campaigns.cancel')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Campaigns List */}
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
                onClick={() => setShowCreateForm(true)}
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
    </div>
  );
}