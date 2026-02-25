import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronRight, ChevronLeft, Store, PackageSearch, QrCode, CheckCircle2, Loader2 } from 'lucide-react';

export default function Onboarding() {
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    const { t } = useLanguage();

    const STEPS = [
        { id: 'profile', title: t('onboarding.titleProfile'), icon: Store, description: t('onboarding.descProfile') },
        { id: 'inventory', title: t('onboarding.titleProduct'), icon: PackageSearch, description: t('onboarding.descProduct') },
        { id: 'qr', title: t('onboarding.titleQR'), icon: QrCode, description: t('onboarding.descQR') },
        { id: 'done', title: t('onboarding.titleDone'), icon: CheckCircle2, description: t('onboarding.descDone') }
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form states
    const [restaurantName, setRestaurantName] = useState(profile?.restaurant_name || '');
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('0');
    const [qrTitle, setQrTitle] = useState('Ganhe um brinde!');
    const [qrText, setQrText] = useState('Cadastre-se na nossa lista e receba novidades.');

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) setCurrentStep(s => s + 1);
    };
    const handlePrev = () => {
        if (currentStep > 0) setCurrentStep(s => s - 1);
    };

    const finishOnboarding = async () => {
        if (!user) return;
        setIsSubmitting(true);

        try {
            // 1. Update Profile (Restaurant Name & QR settings)
            await supabase.from('profiles').update({
                restaurant_name: restaurantName,
                qr_promotional_title: qrTitle,
                qr_promotional_text: qrText,
                onboarding_completed: true // NOTE: will need this column in DB if not exists
            }).eq('id', user.id);

            // 2. Create Initial Product (if provided)
            if (productName.trim()) {
                await supabase.from('products').insert([{
                    user_id: user.id,
                    name: productName,
                    sell_price: Number(productPrice),
                    current_stock: 10,
                    min_stock: 2,
                    active: true,
                    show_in_pos: true
                }]);
            }

            // Finish & Redirect
            navigate('/dashboard');
        } catch (error) {
            console.error('Error in onboarding:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-4 animate-fade-in">
                        <div className="space-y-2">
                            <Label>{t('onboarding.restaurantName')}</Label>
                            <Input
                                value={restaurantName}
                                onChange={(e) => setRestaurantName(e.target.value)}
                                placeholder="Ex: Cantina do Mario"
                                required
                            />
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className="space-y-4 animate-fade-in">
                        <div className="space-y-2">
                            <Label>{t('onboarding.productName')}</Label>
                            <Input
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="Ex: Hambúrguer Clássico"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('onboarding.productPrice')}</Label>
                            <Input
                                type="number" step="0.01" min="0"
                                value={productPrice}
                                onChange={(e) => setProductPrice(e.target.value)}
                            />
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4 animate-fade-in">
                        <div className="space-y-2">
                            <Label>{t('onboarding.qrTitle')}</Label>
                            <Input
                                value={qrTitle}
                                onChange={(e) => setQrTitle(e.target.value)}
                                placeholder="Ex: Ganhe 10% na próxima visita!"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('onboarding.qrText')}</Label>
                            <Input
                                value={qrText}
                                onChange={(e) => setQrText(e.target.value)}
                                placeholder="Ex: Preencha nosso form rápido."
                            />
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="text-center space-y-4 py-6 animate-fade-in">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold">{t('onboarding.titleDone')}</h3>
                        <p className="text-muted-foreground">{t('onboarding.successText')}</p>
                    </div>
                );
            default:
                return null;
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl shadow-lg border-primary/20">
                <CardHeader className="text-center pb-8 border-b">
                    <div className="flex justify-center mb-4">
                        {STEPS.map((step, idx) => {
                            const Icon = step.icon;
                            const isActive = idx === currentStep;
                            const isPassed = idx < currentStep;
                            return (
                                <div key={step.id} className="flex items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-primary text-primary-foreground' : isPassed ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    {idx < STEPS.length - 1 && (
                                        <div className={`h-1 w-12 mx-2 rounded ${isPassed ? 'bg-primary/20' : 'bg-muted'}`} />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                    <CardTitle className="text-2xl">{STEPS[currentStep].title}</CardTitle>
                    <CardDescription className="text-base">{STEPS[currentStep].description}</CardDescription>
                </CardHeader>

                <CardContent className="pt-8 min-h-[50px]">
                    {renderCurrentStep()}
                </CardContent>

                <CardFooter className="flex justify-between border-t pt-6">
                    <Button variant="ghost" onClick={handlePrev} disabled={currentStep === 0 || currentStep === STEPS.length - 1}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        {t('common.cancel')}
                    </Button>

                    {currentStep < STEPS.length - 1 ? (
                        <Button onClick={handleNext} disabled={currentStep === 0 && !restaurantName.trim()}>
                            {t('common.save')}
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={finishOnboarding} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                            {t('onboarding.finish')}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
