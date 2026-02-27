import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import dopplerDineLogo from '@/assets/dopplerDine-logo.png';

export function AppFooter() {
    const { t } = useLanguage();

    return (
        <footer className="bg-muted/50 border-t border-border mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <img src={dopplerDineLogo} alt="DopplerDine" className="w-8 h-8" />
                            <span className="text-lg font-bold">DopplerDine</span>
                        </div>
                        <p className="text-muted-foreground text-sm max-w-md">
                            {t('footer.description')}
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">{t('footer.features')}</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>{t('footer.contactCollection')}</li>
                            <li>{t('footer.automatedCampaigns')}</li>
                            <li>{t('footer.referralProgram')}</li>
                            <li>{t('footer.detailedAnalytics')}</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">{t('footer.support')}</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/support" className="hover:text-primary transition-colors">{t('footer.contact') || 'Contato'}</Link></li>
                            <li><Link to="/support" className="hover:text-primary transition-colors">{t('footer.faq') || 'Perguntas Frequentes'}</Link></li>
                            <li><Link to="/privacy" className="hover:text-primary transition-colors">{t('footer.privacy') || 'Política de Privacidade'}</Link></li>
                            <li><Link to="/terms" className="hover:text-primary transition-colors">{t('footer.terms') || 'Termos de Uso'}</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
                    © 2024 DopplerDine. {t('footer.allRights')}
                </div>
            </div>
        </footer>
    );
}
