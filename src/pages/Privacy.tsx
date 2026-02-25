import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Lock, FileText, ChevronLeft, Trash2, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export default function Privacy() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleDeletionRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('deletion_requests')
                .insert([{ email }]);

            if (error) throw error;

            setSubmitted(true);
            setEmail('');
            toast({
                title: "Solicitação enviada",
                description: "Sua solicitação de exclusão foi recebida e será processada.",
            });
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: "Erro",
                description: "Não foi possível enviar a solicitação. Tente novamente mais tarde.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-8"
                >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Button>

                <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
                    <div className="p-8 sm:p-12">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <Shield className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                    {t('privacy.title')}
                                </h1>
                                <p className="text-muted-foreground mt-1">
                                    {t('privacy.lastUpdated')} {new Date().toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <p className="text-lg text-muted-foreground mb-8">
                            {t('privacy.subtitle')}
                        </p>

                        <div className="space-y-8">
                            <section>
                                <p className="text-foreground leading-relaxed">
                                    {t('privacy.intro')}
                                </p>
                            </section>

                            <div className="border-t border-border pt-8"></div>

                            <section className="flex gap-4">
                                <div className="mt-1 flex-shrink-0">
                                    <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold mb-3">{t('privacy.dataCollectionTitle')}</h2>
                                    <p className="text-foreground leading-relaxed">
                                        {t('privacy.dataCollectionText')}
                                    </p>
                                </div>
                            </section>

                            <section className="flex gap-4">
                                <div className="mt-1 flex-shrink-0">
                                    <Lock className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold mb-3">{t('privacy.lgpdTitle')}</h2>
                                    <p className="text-foreground leading-relaxed">
                                        {t('privacy.lgpdText')}
                                    </p>
                                </div>
                            </section>

                            <section className="flex gap-4">
                                <div className="mt-1 flex-shrink-0">
                                    <Shield className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold mb-3">{t('privacy.securityTitle')}</h2>
                                    <p className="text-foreground leading-relaxed">
                                        {t('privacy.securityText')}
                                    </p>
                                </div>
                            </section>

                            <div className="bg-destructive/5 p-6 rounded-lg mt-8 border border-destructive/20">
                                <div className="flex items-center space-x-2 mb-4">
                                    <Trash2 className="h-5 w-5 text-destructive" />
                                    <h3 className="text-lg font-medium text-destructive">Solicitar Exclusão de Dados</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-6">
                                    Para exercer seu direito ao esquecimento e apagar todos os contatos associados ao seu e-mail da nossa base de dados, utilize o formulário abaixo.
                                </p>

                                {submitted ? (
                                    <div className="bg-green-500/10 border border-green-500/20 text-green-600 p-4 rounded text-sm text-center font-medium">
                                        Recebemos sua solicitação! Seus dados serão excluídos de todos os sistemas associados dentro do prazo legal.
                                    </div>
                                ) : (
                                    <form onSubmit={handleDeletionRequest} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="deletion-email">Seu Endereço de E-mail</Label>
                                            <Input
                                                id="deletion-email"
                                                type="email"
                                                placeholder="email@exemplo.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="bg-background"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            variant="destructive"
                                            disabled={isSubmitting || !email}
                                            className="w-full sm:w-auto"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <Send className="mr-2 h-4 w-4" />
                                            )}
                                            Enviar Solicitação Oficial
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
