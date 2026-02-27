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
      title: t('settings.savedTitle'),
      description: t('settings.savedDesc'),
    });
  };

  const updateSetting = <C extends keyof typeof settings, K extends keyof typeof settings[C]>(
    category: C,
    key: K,
    value: typeof settings[C][K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Hierarquia visual clara */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8" />
            {t('nav.settings')}
          </h1>
          <p className="text-muted-foreground">{t('settings.personalize')}</p>
        </div>

        <div className="space-y-8">
          {/* Notificações - Agrupamento por funcionalidade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                {t('settings.notifications')}
              </CardTitle>
              <CardDescription>
                {t('settings.notificationsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <Label htmlFor="email-notifications" className="text-sm font-medium">
                        {t('settings.emailNotifs')}
                      </Label>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) => updateSetting('notifications', 'email', checked)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground ml-7">
                    {t('settings.emailNotifsDesc')}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-4 h-4 text-muted-foreground" />
                      <Label htmlFor="push-notifications" className="text-sm font-medium">
                        {t('settings.pushNotifs')}
                      </Label>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) => updateSetting('notifications', 'push', checked)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground ml-7">
                    {t('settings.pushNotifsDesc')}
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
                    {t('settings.smsNotifsDesc')}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Volume2 className="w-4 h-4 text-muted-foreground" />
                      <Label htmlFor="marketing-notifications" className="text-sm font-medium">
                        {t('settings.marketingNotifs')}
                      </Label>
                    </div>
                    <Switch
                      id="marketing-notifications"
                      checked={settings.notifications.marketing}
                      onCheckedChange={(checked) => updateSetting('notifications', 'marketing', checked)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground ml-7">
                    {t('settings.marketingNotifsDesc')}
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
                {t('settings.appearance')}
              </CardTitle>
              <CardDescription>
                {t('settings.appearanceDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">{t('settings.themeLabel')}</Label>
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
                  <Label className="text-sm font-medium">{t('settings.languageLabel')}</Label>
                  <Select
                    value={settings.preferences.language}
                    onValueChange={(value) => updateSetting('preferences', 'language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">{t('settings.langPt')}</SelectItem>
                      <SelectItem value="en-US">{t('settings.langEn')}</SelectItem>
                      <SelectItem value="es-ES">{t('settings.langEs')}</SelectItem>
                      <SelectItem value="fr-FR">{t('settings.langFr')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="sound-effects" className="text-sm font-medium">
                    {t('settings.soundEffects')}
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
                {t('settings.privacySecurity')}
              </CardTitle>
              <CardDescription>
                {t('settings.privacyDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="analytics" className="text-sm font-medium">
                      {t('settings.usageAnalytics')}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t('settings.usageDesc')}
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
                      {t('settings.functionalCookies')}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t('settings.cookiesDesc')}
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
                      {t('settings.dataSharing')}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t('settings.dataSharingDesc')}
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
                {t('settings.dataBackup')}
              </CardTitle>
              <CardDescription>
                {t('settings.dataBackupDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start" onClick={() => {
                  try {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
                    const downloadAnchorNode = document.createElement('a');
                    downloadAnchorNode.setAttribute("href", dataStr);
                    downloadAnchorNode.setAttribute("download", "resto_magic_settings.json");
                    document.body.appendChild(downloadAnchorNode);
                    downloadAnchorNode.click();
                    downloadAnchorNode.remove();
                    toast({ title: t('settings.exportSuccess') || "Exportação Concluída", description: "Seus dados foram exportados com sucesso." });
                  } catch (error) {
                    toast({ title: "Erro na Exportação", description: "Não foi possível exportar os dados.", variant: "destructive" });
                  }
                }}>
                  <Database className="w-4 h-4 mr-2" />
                  {t('settings.exportData')}
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => toast({ title: t('settings.autoBackupEnabled') || "Backup Automático", description: "Configuração de backup automático alternada." })}>
                  <Shield className="w-4 h-4 mr-2" />
                  {t('settings.autoBackup')}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('settings.backupInfo')}
              </p>
            </CardContent>
          </Card>

          {/* Botão de Salvar - Lei de Fitts (posição acessível) */}
          <div className="flex justify-end pt-6">
            <Button onClick={handleSave} size="lg" className="px-8">
              {t('settings.save')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}