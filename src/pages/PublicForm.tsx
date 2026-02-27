import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Utensils, Gift } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const formSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: z.string().min(8, 'Telefone deve ter pelo menos 8 dígitos').regex(
    /^(\+41|0041|\+55|0055|\(\d{2}\)|\d{2}|\d{1,4})[0-9\s\-()]{6,15}$/,
    'Formato de telefone inválido (aceita Brasil, Suíça e outros formatos internacionais)'
  ),
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  notes: z.string().optional(),
  privacyConsent: z.boolean().refine(val => val === true, {
    message: 'Required',
  }),
});

type FormData = z.infer<typeof formSchema>;

interface RestaurantInfo {
  restaurant_name: string;
  owner_name: string;
  user_id: string;
  qr_promotional_title?: string | null;
  qr_promotional_text?: string | null;
}

export default function PublicForm() {
  const { qrCode } = useParams<{ qrCode: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedeemed, setIsRedeemed] = useState(false);
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const [nameValue, phoneValue, emailValue, privacyConsentValue] = watch(['name', 'phone', 'email', 'privacyConsent']);

  const isFormValid =
    privacyConsentValue &&
    nameValue?.trim().length >= 2 &&
    phoneValue?.trim().length >= 8 &&
    emailValue?.trim().length >= 1;

  useEffect(() => {
    const fetchRestaurantInfo = async () => {
      if (!qrCode) {
        navigate('/');
        return;
      }

      // Check if already redeemed on this device
      const redeemed = localStorage.getItem(`redeemed_${qrCode}`);
      if (redeemed === 'true') {
        setIsRedeemed(true);
      }

      console.log('QR Code recebido:', qrCode);

      setIsLoading(true);
      try {
        // Fetch restaurant info from Supabase using the QR code
        const { data, error } = await supabase
          .from('profiles')
          .select('restaurant_name, owner_name, user_id, qr_promotional_title, qr_promotional_text')
          .eq('qr_code', qrCode.trim())
          .single();

        if (error) {
          throw new Error('QR Code não encontrado');
        }

        setRestaurantInfo(data);
      } catch (error: unknown) {
        console.error('Error:', error);
        toast({
          title: t('publicForm.error'),
          description: error instanceof Error ? error.message : t('publicForm.unexpectedError'),
          variant: "destructive"
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurantInfo();
  }, [qrCode, navigate, toast, t]);

  const onSubmit = async (data: FormData) => {
    if (!qrCode || !restaurantInfo) return;

    setIsSubmitting(true);
    try {
      // Check for existing phone number to prevent duplicates
      const { data: existingContact, error: checkError } = await supabase
        .from('contacts')
        .select('id')
        .eq('user_id', restaurantInfo.user_id)
        .eq('phone', data.phone)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingContact) {
        // Prevent submission, mark as redeemed
        localStorage.setItem(`redeemed_${qrCode}`, 'true');
        setIsRedeemed(true);
        toast({
          title: t('publicForm.alreadyRedeemedTitle'),
          description: t('publicForm.alreadyRedeemedText'),
          variant: "destructive"
        });
        return;
      }

      // Submit form directly to Supabase
      const { error } = await supabase
        .from('contacts')
        .insert([{
          user_id: restaurantInfo.user_id,
          name: data.name,
          phone: data.phone,
          email: data.email || null,
          notes: data.notes || null,
          source: 'qr_scan',
          last_contact_date: new Date().toISOString(),
        }]);

      if (error) {
        // Handle postgres unique constraint violation if migration is applied
        if (error.code === '23505') {
          localStorage.setItem(`redeemed_${qrCode}`, 'true');
          setIsRedeemed(true);
          return;
        }
        throw error;
      }

      toast({
        title: t('publicForm.success'),
        description: `${t('publicForm.thankYou')} ${data.name}! ${t('publicForm.dataSaved')}`,
      });

      // Mark as redeemed locally to prevent multiple submissions and show the reward screen
      localStorage.setItem(`redeemed_${qrCode}`, 'true');
      setIsRedeemed(true);

    } catch (error: unknown) {
      console.error('Error submitting form:', error);
      toast({
        title: t('publicForm.error'),
        description: error instanceof Error ? error.message : t('publicForm.cannotSave'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>{t('publicForm.loading')}</span>
        </div>
      </div>
    );
  }

  if (!restaurantInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 py-8 px-4">
      <div className="max-w-md mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Utensils className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                {restaurantInfo.restaurant_name}
              </CardTitle>
              <CardDescription className="text-base">
                {t('publicForm.leaveData')}
              </CardDescription>
            </div>
            {restaurantInfo.qr_promotional_title && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-6 animate-in fade-in zoom-in text-left">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Gift className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-primary">
                    {restaurantInfo.qr_promotional_title}
                  </h3>
                </div>
                {restaurantInfo.qr_promotional_text && (
                  <p className="text-sm text-primary/80 text-center">
                    {restaurantInfo.qr_promotional_text}
                  </p>
                )}
              </div>
            )}
          </CardHeader>

          <CardContent>
            {isRedeemed ? (
              <div className="space-y-6 text-center animate-in fade-in slide-in-bottom-4">
                <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-6 rounded-xl border border-green-200 dark:border-green-800">
                  <Gift className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">
                    {restaurantInfo.qr_promotional_title || t('publicForm.alreadyRedeemedTitle')}
                  </h3>
                  <p className="text-base opacity-90 mb-4 text-balance">
                    {restaurantInfo.qr_promotional_text || t('publicForm.alreadyRedeemedText')}
                  </p>
                  <div className="my-4 py-3 bg-white/60 dark:bg-black/40 rounded-lg">
                    <p className="text-sm font-medium opacity-80 mb-1">{t('publicForm.redeemedAt')}</p>
                    <p className="text-lg font-bold">
                      {new Date().toLocaleDateString()} {t('publicForm.at')} {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="bg-white/50 dark:bg-black/50 p-3 rounded-lg text-sm font-medium border border-green-100 dark:border-green-900/50">
                    {t('publicForm.takeScreenshot')}
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('publicForm.fullName')} *</Label>
                  <Input
                    id="name"
                    placeholder={t('publicForm.yourName')}
                    {...register('name')}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t('publicForm.whatsappPhone')} *</Label>
                  <Input
                    id="phone"
                    placeholder="(11) 99999-9999"
                    {...register('phone')}
                    className={errors.phone ? 'border-destructive' : ''}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('publicForm.emailLabel')} *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    {...register('email')}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">{t('publicForm.commentsOptional')}</Label>
                  <Textarea
                    id="notes"
                    placeholder={t('publicForm.leaveComment')}
                    rows={3}
                    {...register('notes')}
                  />
                </div>

                <div className="space-y-4 pt-2">
                  <Controller
                    name="privacyConsent"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="privacyConsent"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <div className="grid gap-1 leading-none">
                          <Label
                            htmlFor="privacyConsent"
                            className="text-sm text-muted-foreground leading-snug cursor-pointer"
                          >
                            {t('publicForm.privacyConsent')}
                          </Label>
                          {errors.privacyConsent && (
                            <p className="text-sm text-destructive">{t('publicForm.privacyRequired')}</p>
                          )}
                        </div>
                      </div>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || !isFormValid}
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('publicForm.saving')}
                    </>
                  ) : (
                    t('publicForm.saveData')
                  )}
                </Button>
              </form>
            )}

            {!isRedeemed && (
              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>{t('publicForm.dataSecure')} {restaurantInfo.restaurant_name}.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}