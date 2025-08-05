import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { UserCircle, Camera, Save, Mail, Building, User, MapPin } from 'lucide-react';
import Layout from '@/components/Layout';

export default function Profile() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    owner_name: profile?.owner_name || '',
    restaurant_name: profile?.restaurant_name || '',
    phone: profile?.phone || '',
    address: '',
    description: ''
  });

  const handleSave = async () => {
    // Simulação de salvamento - aqui você implementaria a lógica real
    toast({
      title: t('profile.saved'),
      description: t('profile.savedDescription'),
    });
    setIsEditing(false);
  };

  const getInitials = () => {
    const name = formData.owner_name || user?.email || '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header com princípio de hierarquia visual */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{t('profile.title')}</h1>
            <p className="text-muted-foreground">{t('profile.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Card do Avatar - Aplicando lei de Fitts (elemento importante em destaque) */}
            <Card className="lg:col-span-1 h-fit">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-primary/20">
                      <AvatarImage src="" alt="Profile" />
                      <AvatarFallback className="text-2xl bg-gradient-primary text-primary-foreground">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-xl">{formData.owner_name || t('profile.nameNotProvided')}</CardTitle>
                <CardDescription className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Informações principais - Agrupamento Gestalt */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <UserCircle className="w-5 h-5" />
                    {t('profile.personalInfo')}
                  </CardTitle>
                  <CardDescription>
                    {t('profile.personalInfoDescription')}
                  </CardDescription>
                </div>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  size="sm"
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isEditing ? t('common.save') : t('common.edit')}
                </Button>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Grid responsivo seguindo princípios de escaneabilidade */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="owner_name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {t('profile.ownerName')}
                    </Label>
                    <Input
                      id="owner_name"
                      value={formData.owner_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, owner_name: e.target.value }))}
                      disabled={!isEditing}
                      placeholder={t('profile.ownerNamePlaceholder')}
                      className={isEditing ? "border-primary/50 focus:border-primary" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="restaurant_name" className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      {t('profile.restaurantName')}
                    </Label>
                    <Input
                      id="restaurant_name"
                      value={formData.restaurant_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, restaurant_name: e.target.value }))}
                      disabled={!isEditing}
                      placeholder={t('profile.restaurantNamePlaceholder')}
                      className={isEditing ? "border-primary/50 focus:border-primary" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {t('profile.phone')}
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="(11) 99999-9999"
                      className={isEditing ? "border-primary/50 focus:border-primary" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {t('profile.address')}
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      disabled={!isEditing}
                      placeholder={t('profile.addressPlaceholder')}
                      className={isEditing ? "border-primary/50 focus:border-primary" : ""}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t('profile.restaurantDescription')}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    disabled={!isEditing}
                    placeholder={t('profile.restaurantDescriptionPlaceholder')}
                    rows={4}
                    className={isEditing ? "border-primary/50 focus:border-primary" : ""}
                  />
                </div>

                {/* Feedback visual para estado de edição */}
                {isEditing && (
                  <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-sm text-primary font-medium">{t('profile.editModeActive')}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Estatísticas rápidas - Princípio de reconhecimento vs recall */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="text-center p-6">
              <div className="text-2xl font-bold text-primary mb-2">156</div>
              <div className="text-sm text-muted-foreground">{t('profile.contactsCollected')}</div>
            </Card>
            <Card className="text-center p-6">
              <div className="text-2xl font-bold text-green-600 mb-2">89%</div>
              <div className="text-sm text-muted-foreground">{t('profile.engagementRate')}</div>
            </Card>
            <Card className="text-center p-6">
              <div className="text-2xl font-bold text-blue-600 mb-2">12</div>
              <div className="text-sm text-muted-foreground">{t('profile.activeCampaigns')}</div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}