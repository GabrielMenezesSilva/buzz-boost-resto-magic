import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type Language = 'fr' | 'en' | 'it' | 'de';

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
  },
  it: {
    // Navigation
    'nav.home': 'Home',
    'nav.plans': 'Prezzi',
    'nav.generateQr': 'Genera QR',
    'nav.dashboard': 'Dashboard',
    'nav.contacts': 'Contatti',
    'nav.campaigns': 'Campagne',
    'nav.templates': 'Modelli',
    'nav.login': 'Accedi',
    'nav.logout': 'Esci',
    
    // Auth
    'auth.hello': 'Ciao',
    'auth.loggedAs': 'Connesso come',
    'auth.user': 'Utente',
    
    // Plans page
    'plans.badge': 'Sistema di Marketing Premium',
    'plans.title': 'Rivoluziona il Marketing del Tuo Ristorante',
    'plans.subtitle': 'Cattura contatti, costruisci relazioni e aumenta le tue vendite con la nostra piattaforma completa di marketing digitale per ristoranti.',
    'plans.whyChoose': 'Perché scegliere la nostra piattaforma?',
    'plans.captureMore': 'Cattura Più Clienti',
    'plans.captureDesc': 'Trasforma i visitatori in contatti con QR code strategici',
    'plans.directComm': 'Comunicazione Diretta',
    'plans.directCommDesc': 'Invia campagne SMS personalizzate ai tuoi clienti',
    'plans.measurableResults': 'Risultati Misurabili',
    'plans.measurableDesc': 'Traccia le metriche e ottimizza le tue campagne marketing',
    'plans.singlePlan': 'Piano Unico, Funzionalità Complete',
    'plans.transformDesc': 'Tutto ciò di cui hai bisogno per trasformare il tuo ristorante',
    'plans.mostPopular': 'Più Popolare',
    'plans.professional': 'Piano Professionale',
    'plans.forRestaurants': 'Per i ristoranti che vogliono crescere',
    'plans.perMonth': '/mese',
    'plans.startNow': 'Inizia Ora',
    'plans.cancelAnytime': 'Cancella in qualsiasi momento • Support 24/7 • Nessun costo nascosto',
    'plans.joinRestaurants': 'Unisciti ai ristoranti che stanno già crescendo',
    'plans.contactIncrease': 'Aumento nella cattura di contatti',
    'plans.openRate': 'Tasso di apertura campagne SMS',
    'plans.customerReturn': 'Ritorno dei clienti',
    'plans.readyTransform': 'Pronto a trasformare il tuo ristorante?',
    'plans.seeResults': 'Inizia oggi e vedi i risultati in 30 giorni o meno',
    'plans.startTransformation': 'Inizia La Mia Trasformazione',
    
    // Features
    'features.qrCode': 'QR Code personalizzato per il tuo ristorante',
    'features.unlimitedCapture': 'Cattura illimitata di contatti clienti',
    'features.smsCompaigns': 'Campagne SMS professionali',
    'features.templates': 'Modelli di messaggi personalizzabili',
    'features.analytics': 'Analytics dettagliate delle campagne',
    'features.contactManagement': 'Gestione completa dei contatti',
    'features.prioritySupport': 'Supporto tecnico prioritario',
    'features.autoUpdates': 'Aggiornamenti automatici',
    
    // Footer
    'footer.features': 'Funzionalità',
    'footer.contactCollection': 'Raccolta contatti',
    'footer.automatedCampaigns': 'Campagne automatizzate',
    'footer.referralProgram': 'Programma di referral',
    'footer.detailedAnalytics': 'Analytics dettagliate',
    'footer.support': 'Supporto',
    'footer.documentation': 'Documentazione',
    'footer.contact': 'Contatto',
    'footer.faq': 'FAQ',
    'footer.onlineHelp': 'Aiuto online',
    'footer.allRights': 'Tutti i diritti riservati.',
    'footer.description': 'Aumenta i tuoi ricavi nei giorni di basso traffico con la nostra soluzione di fidelizzazione e marketing mirato.',
  },
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.plans': 'Preise',
    'nav.generateQr': 'QR Generieren',
    'nav.dashboard': 'Dashboard',
    'nav.contacts': 'Kontakte',
    'nav.campaigns': 'Kampagnen',
    'nav.templates': 'Vorlagen',
    'nav.login': 'Anmelden',
    'nav.logout': 'Abmelden',
    
    // Auth
    'auth.hello': 'Hallo',
    'auth.loggedAs': 'Angemeldet als',
    'auth.user': 'Benutzer',
    
    // Plans page
    'plans.badge': 'Premium Marketing System',
    'plans.title': 'Revolutionieren Sie Ihr Restaurant Marketing',
    'plans.subtitle': 'Erfassen Sie Kontakte, bauen Sie Beziehungen auf und steigern Sie Ihre Verkäufe mit unserer kompletten digitalen Marketing-Plattform für Restaurants.',
    'plans.whyChoose': 'Warum unsere Plattform wählen?',
    'plans.captureMore': 'Mehr Kunden Erfassen',
    'plans.captureDesc': 'Verwandeln Sie Besucher in Kontakte mit strategischen QR-Codes',
    'plans.directComm': 'Direkte Kommunikation',
    'plans.directCommDesc': 'Senden Sie personalisierte SMS-Kampagnen an Ihre Kunden',
    'plans.measurableResults': 'Messbare Ergebnisse',
    'plans.measurableDesc': 'Verfolgen Sie Metriken und optimieren Sie Ihre Marketing-Kampagnen',
    'plans.singlePlan': 'Ein Plan, Vollständige Funktionen',
    'plans.transformDesc': 'Alles was Sie brauchen, um Ihr Restaurant zu transformieren',
    'plans.mostPopular': 'Am Beliebtesten',
    'plans.professional': 'Professional Plan',
    'plans.forRestaurants': 'Für Restaurants, die wachsen wollen',
    'plans.perMonth': '/Monat',
    'plans.startNow': 'Jetzt Starten',
    'plans.cancelAnytime': 'Jederzeit kündbar • 24/7 Support • Keine versteckten Gebühren',
    'plans.joinRestaurants': 'Schließen Sie sich Restaurants an, die bereits wachsen',
    'plans.contactIncrease': 'Steigerung der Kontakterfassung',
    'plans.openRate': 'SMS-Kampagnen Öffnungsrate',
    'plans.customerReturn': 'Kundenrückkehr',
    'plans.readyTransform': 'Bereit, Ihr Restaurant zu transformieren?',
    'plans.seeResults': 'Starten Sie heute und sehen Sie Ergebnisse in 30 Tagen oder weniger',
    'plans.startTransformation': 'Meine Transformation Starten',
    
    // Features
    'features.qrCode': 'Benutzerdefinierter QR-Code für Ihr Restaurant',
    'features.unlimitedCapture': 'Unbegrenzte Kundenkontakt-Erfassung',
    'features.smsCompaigns': 'Professionelle SMS-Kampagnen',
    'features.templates': 'Anpassbare Nachrichten-Vorlagen',
    'features.analytics': 'Detaillierte Kampagnen-Analytics',
    'features.contactManagement': 'Vollständige Kontaktverwaltung',
    'features.prioritySupport': 'Priority technischer Support',
    'features.autoUpdates': 'Automatische Updates',
    
    // Footer
    'footer.features': 'Funktionen',
    'footer.contactCollection': 'Kontaktsammlung',
    'footer.automatedCampaigns': 'Automatisierte Kampagnen',
    'footer.referralProgram': 'Empfehlungsprogramm',
    'footer.detailedAnalytics': 'Detaillierte Analytics',
    'footer.support': 'Support',
    'footer.documentation': 'Dokumentation',
    'footer.contact': 'Kontakt',
    'footer.faq': 'FAQ',
    'footer.onlineHelp': 'Online-Hilfe',
    'footer.allRights': 'Alle Rechte vorbehalten.',
    'footer.description': 'Steigern Sie Ihren Umsatz an schwächeren Tagen mit unserer Kundenbindungs- und gezielten Marketing-Lösung.',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('fr');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['fr', 'en', 'it', 'de'].includes(savedLanguage)) {
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