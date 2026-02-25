import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Scale, FileText, UserCheck, ShieldAlert } from 'lucide-react';

export default function Terms() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
            <Scale className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            {t('terms.title') || 'Termos de Serviço'}
          </h1>
          <p className="text-muted-foreground">
            {t('terms.lastUpdated') || 'Última atualização: Fevereiro de 2026'}
          </p>
        </div>

        <div className="space-y-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <div className="h-1 w-full bg-gradient-primary"></div>
            <CardContent className="p-8">
              <p className="text-lg text-muted-foreground mb-8">
                {t('terms.intro') || 'Bem-vindo ao DopplerDine. Ao utilizar nossa plataforma, você concorda expressamente com os termos estabelecidos abaixo e com nossa Política de Privacidade.'}
              </p>

              <div className="space-y-10">
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <UserCheck className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-semibold text-foreground">
                      {t('terms.usageTitle') || '1. Condições de Uso'}
                    </h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-9 border-l-2 border-primary/20">
                    {t('terms.usageText') || 'O DopplerDine oferece uma licença revogável, não exclusiva e intransferível para o uso de sua plataforma de CRM e Cardápios Digitais. Você é responsável por manter a confidencialidade da sua conta e senha.'}
                  </p>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-semibold text-foreground">
                      {t('terms.contentTitle') || '2. Propriedade Intelectual'}
                    </h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-9 border-l-2 border-primary/20">
                    {t('terms.contentText') || 'Todos os direitos, incluindo software, marcas e design, permanecem sendo propriedade exclusiva da DopplerDine. Você mantém total controle sobre os dados dos SEUS clientes coletados através dos nossos formulários.'}
                  </p>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldAlert className="w-6 h-6 text-destructive" />
                    <h2 className="text-2xl font-semibold text-foreground">
                      {t('terms.liabilityTitle') || '3. Limitação de Responsabilidade'}
                    </h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-9 border-l-2 border-destructive/20">
                    {t('terms.liabilityText') || 'A plataforma é fornecida "como está". A DopplerDine não se responsabiliza por perda de lucros, interrupções no serviço com terceiros (ex: WhatsApp, Envios SMS) ou exclusão indevida de dados por parte do Lojista.'}
                  </p>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
