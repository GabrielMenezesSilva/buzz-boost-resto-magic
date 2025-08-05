import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { QrCode, Download, Share, Copy, Loader2 } from 'lucide-react';
import QRCode from 'qrcode';

interface QRGeneratorProps {
  className?: string;
}

export default function QRGenerator({ className }: QRGeneratorProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [restaurantName, setRestaurantName] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !user.profile) return;

      try {
        // Get profile data from auth context (already loaded)
        const profileData = user.profile;
        setQrCode(profileData.qr_code);
        setRestaurantName(profileData.restaurant_name || 'Meu Restaurante');
        
        // Generate QR code image
        const url = `${window.location.origin}/form/${profileData.qr_code}`;
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
  }, [user, toast]);

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
        <div className="flex gap-2">
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
            className="flex-1"
          >
            <Share className="h-4 w-4 mr-2" />
            {t('qrGenerator.share')}
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