import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.plans': 'Tarifs',
    'nav.generateQr': 'Générer QR',
    'nav.dashboard': 'Tableau de bord',
    'nav.contacts': 'Contacts',
    'nav.campaigns': 'Campagnes',
    'nav.templates': 'Modèles',
    'nav.login': 'Se connecter',
    'nav.logout': 'Se déconnecter',
    
    // Auth
    'auth.hello': 'Bonjour',
    'auth.loggedAs': 'Connecté en tant que',
    'auth.user': 'Utilisateur',
    
    // Plans page
    'plans.badge': 'Système Premium de Marketing',
    'plans.title': 'Révolutionnez le Marketing de Votre Restaurant',
    'plans.subtitle': 'Capturez des contacts, construisez des relations et augmentez vos ventes avec notre plateforme complète de marketing digital pour restaurants.',
    'plans.whyChoose': 'Pourquoi choisir notre plateforme ?',
    'plans.captureMore': 'Capturez Plus de Clients',
    'plans.captureDesc': 'Transformez les visiteurs en contacts avec des QR codes stratégiques',
    'plans.directComm': 'Communication Directe',
    'plans.directCommDesc': 'Envoyez des campagnes personnalisées par SMS à vos clients',
    'plans.measurableResults': 'Résultats Mesurables',
    'plans.measurableDesc': 'Suivez les métriques et optimisez vos campagnes marketing',
    'plans.singlePlan': 'Plan Unique, Fonctionnalités Complètes',
    'plans.transformDesc': 'Tout ce dont vous avez besoin pour transformer votre restaurant',
    'plans.mostPopular': 'Le Plus Populaire',
    'plans.professional': 'Plan Professionnel',
    'plans.forRestaurants': 'Pour les restaurants qui veulent grandir',
    'plans.perMonth': '/mois',
    'plans.startNow': 'Commencer Maintenant',
    'plans.cancelAnytime': 'Annulez à tout moment • Support 24/7 • Pas de frais cachés',
    'plans.joinRestaurants': 'Rejoignez les restaurants qui grandissent déjà',
    'plans.contactIncrease': 'Augmentation de la capture de contacts',
    'plans.openRate': "Taux d'ouverture des campagnes SMS",
    'plans.customerReturn': 'Retour des clients',
    'plans.readyTransform': 'Prêt à transformer votre restaurant ?',
    'plans.seeResults': 'Commencez aujourd\'hui et voyez les résultats en 30 jours ou moins',
    'plans.startTransformation': 'Démarrer Ma Transformation',
    
    // Features
    'features.qrCode': 'QR Code personnalisé pour votre restaurant',
    'features.unlimitedCapture': 'Capture illimitée de contacts clients',
    'features.smsCompaigns': 'Campagnes SMS professionnelles',
    'features.templates': 'Modèles de messages personnalisables',
    'features.analytics': 'Analytics détaillés des campagnes',
    'features.contactManagement': 'Gestion complète des contacts',
    'features.prioritySupport': 'Support technique prioritaire',
    'features.autoUpdates': 'Mises à jour automatiques',
    
    // Footer
    'footer.features': 'Fonctionnalités',
    'footer.contactCollection': 'Collecte de contacts',
    'footer.automatedCampaigns': 'Campagnes automatisées',
    'footer.referralProgram': 'Programme de parrainage',
    'footer.detailedAnalytics': 'Analytics détaillés',
    'footer.support': 'Support',
    'footer.documentation': 'Documentation',
    'footer.contact': 'Contact',
    'footer.faq': 'FAQ',
    'footer.onlineHelp': 'Aide en ligne',
    'footer.allRights': 'Tous droits réservés.',
    'footer.description': 'Augmentez votre chiffre d\'affaires les jours de faible affluence grâce à notre solution de fidélisation et de marketing ciblé.',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.plans': 'Pricing',
    'nav.generateQr': 'Generate QR',
    'nav.dashboard': 'Dashboard',
    'nav.contacts': 'Contacts',
    'nav.campaigns': 'Campaigns',
    'nav.templates': 'Templates',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    
    // Auth
    'auth.hello': 'Hello',
    'auth.loggedAs': 'Logged in as',
    'auth.user': 'User',
    
    // Plans page
    'plans.badge': 'Premium Marketing System',
    'plans.title': 'Revolutionize Your Restaurant Marketing',
    'plans.subtitle': 'Capture contacts, build relationships and increase your sales with our complete digital marketing platform for restaurants.',
    'plans.whyChoose': 'Why choose our platform?',
    'plans.captureMore': 'Capture More Customers',
    'plans.captureDesc': 'Transform visitors into contacts with strategic QR codes',
    'plans.directComm': 'Direct Communication',
    'plans.directCommDesc': 'Send personalized SMS campaigns to your customers',
    'plans.measurableResults': 'Measurable Results',
    'plans.measurableDesc': 'Track metrics and optimize your marketing campaigns',
    'plans.singlePlan': 'Single Plan, Complete Features',
    'plans.transformDesc': 'Everything you need to transform your restaurant',
    'plans.mostPopular': 'Most Popular',
    'plans.professional': 'Professional Plan',
    'plans.forRestaurants': 'For restaurants that want to grow',
    'plans.perMonth': '/month',
    'plans.startNow': 'Start Now',
    'plans.cancelAnytime': 'Cancel anytime • 24/7 Support • No hidden fees',
    'plans.joinRestaurants': 'Join restaurants that are already growing',
    'plans.contactIncrease': 'Increase in contact capture',
    'plans.openRate': 'SMS campaign open rate',
    'plans.customerReturn': 'Customer return',
    'plans.readyTransform': 'Ready to transform your restaurant?',
    'plans.seeResults': 'Start today and see results in 30 days or less',
    'plans.startTransformation': 'Start My Transformation',
    
    // Features
    'features.qrCode': 'Custom QR Code for your restaurant',
    'features.unlimitedCapture': 'Unlimited customer contact capture',
    'features.smsCompaigns': 'Professional SMS campaigns',
    'features.templates': 'Customizable message templates',
    'features.analytics': 'Detailed campaign analytics',
    'features.contactManagement': 'Complete contact management',
    'features.prioritySupport': 'Priority technical support',
    'features.autoUpdates': 'Automatic updates',
    
    // Footer
    'footer.features': 'Features',
    'footer.contactCollection': 'Contact collection',
    'footer.automatedCampaigns': 'Automated campaigns',
    'footer.referralProgram': 'Referral program',
    'footer.detailedAnalytics': 'Detailed analytics',
    'footer.support': 'Support',
    'footer.documentation': 'Documentation',
    'footer.contact': 'Contact',
    'footer.faq': 'FAQ',
    'footer.onlineHelp': 'Online help',
    'footer.allRights': 'All rights reserved.',
    'footer.description': 'Increase your revenue on low-traffic days with our customer loyalty and targeted marketing solution.',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('fr');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};