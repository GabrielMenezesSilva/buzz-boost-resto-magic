import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { QrCode, Download, Share, Copy, Loader2, Save, Gift, Printer } from 'lucide-react';
import QRCode from 'qrcode';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface QRGeneratorProps {
  className?: string;
}

export default function QRGenerator({ className }: QRGeneratorProps) {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [restaurantName, setRestaurantName] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [incentiveTitle, setIncentiveTitle] = useState('');
  const [incentiveText, setIncentiveText] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !profile) return;

      try {
        const { data: dbProfile, error } = await supabase
          .from('profiles')
          .select('*, qr_promotional_title, qr_promotional_text')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        setQrCode(dbProfile.qr_code);
        setRestaurantName(dbProfile.restaurant_name || 'Meu Restaurante');
        setIncentiveTitle(dbProfile.qr_promotional_title || '');
        setIncentiveText(dbProfile.qr_promotional_text || '');

        // Generate QR code image
        const url = `${window.location.origin}/form/${dbProfile.qr_code}`;
        const qrImageUrl = await QRCode.toDataURL(url, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeImage(qrImageUrl);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro inesperado.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, profile, toast]);

  const copyLink = () => {
    if (!qrCode) return;

    const url = `${window.location.origin}/form/${qrCode}`;
    navigator.clipboard.writeText(url);
    toast({
      title: t('qrGenerator.linkCopied'),
      description: t('qrGenerator.linkCopiedDesc'),
    });
  };

  const downloadQR = () => {
    if (!qrCodeImage || !restaurantName) return;

    const link = document.createElement('a');
    link.download = `qr-code-${restaurantName.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = qrCodeImage;
    link.click();
  };

  const saveIncentive = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          qr_promotional_title: incentiveTitle,
          qr_promotional_text: incentiveText
        })
        .eq('user_id', user.id);

      if (error) throw error;
      toast({
        title: t('qrGenerator.incentiveSaved'),
        description: t('qrGenerator.incentiveSavedDesc'),
      });
    } catch (error) {
      console.error('Error saving incentive:', error);
      toast({
        title: t('qrGenerator.saveError'),
        description: t('qrGenerator.saveErrorDesc'),
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const shareQR = async () => {
    if (!qrCode || !navigator.share) {
      copyLink();
      return;
    }

    try {
      await navigator.share({
        title: `Formulário - ${restaurantName}`,
        text: `Acesse nosso formulário para receber ofertas exclusivas!`,
        url: `${window.location.origin}/form/${qrCode}`,
      });
    } catch (error) {
      // Fallback to copy
      copyLink();
    }
  };

  const printQR = () => {
    if (!qrCode) return;
    window.open(`/print/${qrCode}`, '_blank');
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>{t('qrGenerator.loading')}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!qrCode || !qrCodeImage) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">{t('qrGenerator.cannotGenerate')}</p>
        </CardContent>
      </Card>
    );
  }

  const formUrl = `${window.location.origin}/form/${qrCode}`;

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <QrCode className="h-5 w-5" />
          {t('qrForm.title')}
        </CardTitle>
        <CardDescription>
          {t('qrGenerator.shareDescription')}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* QR Code Image */}
        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <img
              src={qrCodeImage}
              alt="QR Code"
              className="w-64 h-64"
            />
          </div>
        </div>

        {/* Incentive Settings */}
        <div className="bg-primary/5 p-5 rounded-lg border border-primary/10 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">{t('qrGenerator.incentiveTitle')}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {t('qrGenerator.incentiveDesc')}
          </p>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label>{t('qrGenerator.promoTitleLabel')}</Label>
              <Input
                placeholder={t('qrGenerator.promoTitlePlaceholder')}
                value={incentiveTitle}
                onChange={(e) => setIncentiveTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>{t('qrGenerator.promoMessageLabel')}</Label>
              <Textarea
                placeholder={t('qrGenerator.promoMessagePlaceholder')}
                rows={2}
                value={incentiveText}
                onChange={(e) => setIncentiveText(e.target.value)}
              />
            </div>
            <Button onClick={saveIncentive} disabled={isSaving} className="w-full mt-2">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {t('qrGenerator.saveIncentive')}
            </Button>
          </div>
        </div>

        {/* URL Display */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('qrGenerator.directLink')}</label>
          <div className="flex gap-2">
            <div className="flex-1 p-2 bg-muted rounded text-sm font-mono break-all">
              {formUrl}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyLink}
              className="shrink-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={downloadQR}
            variant="outline"
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            {t('qrGenerator.downloadQr')}
          </Button>

          <Button
            onClick={shareQR}
            variant="outline"
            className="flex-1"
          >
            <Share className="h-4 w-4 mr-2" />
            {t('qrGenerator.share')}
          </Button>

          <Button
            onClick={printQR}
            className="flex-1"
          >
            <Printer className="h-4 w-4 mr-2" />
            {t('qrGenerator.printDisplay')}
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-primary/5 p-4 rounded-lg">
          <h4 className="font-medium mb-2">{t('qrGenerator.howToUse')}</h4>
          <ol className="text-sm text-muted-foreground space-y-1">
            <li>{t('qrGenerator.instruction1')}</li>
            <li>{t('qrGenerator.instruction2')}</li>
            <li>{t('qrGenerator.instruction3')}</li>
            <li>{t('qrGenerator.instruction4')}</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}