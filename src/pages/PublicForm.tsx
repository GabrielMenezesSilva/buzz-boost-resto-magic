import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Utensils } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const formSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: z.string().min(8, 'Telefone deve ter pelo menos 8 dígitos').regex(
    /^(\+41|0041|\+55|0055|\(\d{2}\)|\d{2}|\d{1,4})[0-9\s\-\(\)]{6,15}$/,
    'Formato de telefone inválido (aceita Brasil, Suíça e outros formatos internacionais)'
  ),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface RestaurantInfo {
  restaurant_name: string;
  owner_name: string;
}

export default function PublicForm() {
  const { qrCode } = useParams<{ qrCode: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchRestaurantInfo = async () => {
      if (!qrCode) {
        navigate('/');
        return;
      }

      console.log('QR Code recebido:', qrCode);
      console.log('QR Code length:', qrCode.length);
      console.log('QR Code trimmed:', qrCode.trim());

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('restaurant_name, owner_name')
          .eq('qr_code', qrCode.trim())
          .maybeSingle();

        if (error) {
          console.error('Error fetching restaurant:', error);
        toast({
          title: t('publicForm.error'),
          description: t('publicForm.couldNotLoad'),
          variant: "destructive"
        });
          navigate('/');
          return;
        }

        if (!data) {
        toast({
          title: t('publicForm.invalidQR'),
          description: t('publicForm.invalidOrExpired'),
          variant: "destructive"
        });
          navigate('/');
          return;
        }

        setRestaurantInfo(data);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: t('publicForm.error'),
          description: t('publicForm.unexpectedError'),
          variant: "destructive"
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurantInfo();
  }, [qrCode, navigate, toast]);

  const onSubmit = async (data: FormData) => {
    if (!qrCode || !restaurantInfo) return;

    setIsSubmitting(true);
    try {
      // Get user_id from profiles table using qr_code
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('qr_code', qrCode.trim())
        .single();

      if (profileError || !profileData) {
        throw new Error(t('publicForm.restaurantNotFound'));
      }

      // Insert contact
      const { error: insertError } = await supabase
        .from('contacts')
        .insert({
          user_id: profileData.user_id,
          name: data.name,
          phone: data.phone,
          email: data.email || null,
          notes: data.notes || null,
          source: 'qr_scan',
          last_contact_date: new Date().toISOString(),
        });

      if (insertError) {
        throw insertError;
      }

      toast({
        title: t('publicForm.success'),
        description: `${t('publicForm.thankYou')} ${data.name}! ${t('publicForm.dataSaved')}`,
      });

      // Redirect to a thank you page or clear form
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: t('publicForm.error'),
        description: error.message || t('publicForm.cannotSave'),
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
          </CardHeader>

          <CardContent>
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
                <Label htmlFor="email">{t('publicForm.emailOptional')}</Label>
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

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
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

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>{t('publicForm.dataSecure')} {restaurantInfo.restaurant_name}.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}