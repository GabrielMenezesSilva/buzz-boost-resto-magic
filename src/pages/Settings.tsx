import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database,
  Moon,
  Sun,
  Monitor,
  Volume2,
  Mail,
  MessageSquare,
  Smartphone
} from 'lucide-react';
import Layout from '@/components/Layout';

export default function Settings() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: true,
      marketing: false
    },
    privacy: {
      analytics: true,
      cookies: true,
      dataSharing: false
    },
    preferences: {
      theme: 'system',
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      soundEffects: true
    }
  });

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram atualizadas com sucesso.",
    });
  };

  const updateSetting = (category: keyof typeof settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header - Hierarquia visual clara */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <SettingsIcon className="w-8 h-8" />
              Configurações
            </h1>
            <p className="text-muted-foreground">Personalize sua experiência no DopplerDine</p>
          </div>

          <div className="space-y-8">
            {/* Notificações - Agrupamento por funcionalidade */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notificações
                </CardTitle>
                <CardDescription>
                  Controle como e quando você recebe notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <Label htmlFor="email-notifications" className="text-sm font-medium">
                          Notificações por Email
                        </Label>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={settings.notifications.email}
                        onCheckedChange={(checked) => updateSetting('notifications', 'email', checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground ml-7">
                      Receba updates sobre campanhas e novos contatos
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-4 h-4 text-muted-foreground" />
                        <Label htmlFor="push-notifications" className="text-sm font-medium">
                          Notificações Push
                        </Label>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={settings.notifications.push}
                        onCheckedChange={(checked) => updateSetting('notifications', 'push', checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground ml-7">
                      Alertas instantâneos no navegador
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <Label htmlFor="sms-notifications" className="text-sm font-medium">
                          SMS
                        </Label>
                      </div>
                      <Switch
                        id="sms-notifications"
                        checked={settings.notifications.sms}
                        onCheckedChange={(checked) => updateSetting('notifications', 'sms', checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground ml-7">
                      Notificações importantes via SMS
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Volume2 className="w-4 h-4 text-muted-foreground" />
                        <Label htmlFor="marketing-notifications" className="text-sm font-medium">
                          Marketing
                        </Label>
                      </div>
                      <Switch
                        id="marketing-notifications"
                        checked={settings.notifications.marketing}
                        onCheckedChange={(checked) => updateSetting('notifications', 'marketing', checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground ml-7">
                      Novidades e promoções do DopplerDine
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Aparência - Princípio de feedback visual imediato */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Aparência
                </CardTitle>
                <CardDescription>
                  Personalize a interface de acordo com suas preferências
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Tema</Label>
                    <Select
                      value={settings.preferences.theme}
                      onValueChange={(value) => updateSetting('preferences', 'theme', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light" className="flex items-center gap-2">
                          <Sun className="w-4 h-4" />
                          Claro
                        </SelectItem>
                        <SelectItem value="dark" className="flex items-center gap-2">
                          <Moon className="w-4 h-4" />
                          Escuro
                        </SelectItem>
                        <SelectItem value="system" className="flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          Sistema
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Idioma</Label>
                    <Select
                      value={settings.preferences.language}
                      onValueChange={(value) => updateSetting('preferences', 'language', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">🇧🇷 Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">🇺🇸 English (US)</SelectItem>
                        <SelectItem value="es-ES">🇪🇸 Español (España)</SelectItem>
                        <SelectItem value="fr-FR">🇫🇷 Français (France)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                    <Label htmlFor="sound-effects" className="text-sm font-medium">
                      Efeitos Sonoros
                    </Label>
                  </div>
                  <Switch
                    id="sound-effects"
                    checked={settings.preferences.soundEffects}
                    onCheckedChange={(checked) => updateSetting('preferences', 'soundEffects', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacidade - Princípio de controle do usuário */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacidade e Segurança
                </CardTitle>
                <CardDescription>
                  Gerencie como seus dados são coletados e utilizados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="analytics" className="text-sm font-medium">
                        Análise de Uso
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Nos ajude a melhorar o produto com dados anônimos de uso
                      </p>
                    </div>
                    <Switch
                      id="analytics"
                      checked={settings.privacy.analytics}
                      onCheckedChange={(checked) => updateSetting('privacy', 'analytics', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="cookies" className="text-sm font-medium">
                        Cookies Funcionais
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Necessários para manter suas preferências e sessão
                      </p>
                    </div>
                    <Switch
                      id="cookies"
                      checked={settings.privacy.cookies}
                      onCheckedChange={(checked) => updateSetting('privacy', 'cookies', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="data-sharing" className="text-sm font-medium">
                        Compartilhamento de Dados
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Permitir compartilhamento com parceiros para melhorar serviços
                      </p>
                    </div>
                    <Switch
                      id="data-sharing"
                      checked={settings.privacy.dataSharing}
                      onCheckedChange={(checked) => updateSetting('privacy', 'dataSharing', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dados e Backup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Dados e Backup
                </CardTitle>
                <CardDescription>
                  Gerencie seus dados e faça backup das informações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start">
                    <Database className="w-4 h-4 mr-2" />
                    Exportar Dados
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Backup Automático
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Seus dados são automaticamente salvos em backup a cada 24 horas.
                  Último backup: há 2 horas
                </p>
              </CardContent>
            </Card>

            {/* Botão de Salvar - Lei de Fitts (posição acessível) */}
            <div className="flex justify-end pt-6">
              <Button onClick={handleSave} size="lg" className="px-8">
                Salvar Configurações
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}