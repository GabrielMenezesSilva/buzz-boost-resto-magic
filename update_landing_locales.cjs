const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const languages = ['en', 'pt-BR', 'es', 'it', 'fr', 'de'];

const newKeys = {
    // --- HOME PAGE REDESIGN ---
    "home.innovative": {
        "pt-BR": "A Evolução do seu Restaurante",
        "en": "The Evolution of your Restaurant",
        "es": "La Evolución de su Restaurante",
        "fr": "L'évolution de votre restaurant",
        "it": "L'Evoluzione del tuo Ristorante",
        "de": "Die Evolution Ihres Restaurants"
    },
    "home.heroTitleLine1": {
        "pt-BR": "Gestão Mágica para",
        "en": "Magic Management for",
        "es": "Gestión Mágica para",
        "fr": "Gestion magique pour",
        "it": "Gestione Magica per",
        "de": "Magisches Management für"
    },
    "home.heroTitleLine2": {
        "pt-BR": "Resultados Reais.",
        "en": "Real Results.",
        "es": "Resultados Reales.",
        "fr": "Des résultats réels.",
        "it": "Risultati Reali.",
        "de": "Reelle Ergebnisse."
    },
    "home.heroSubtitle": {
        "pt-BR": "Do Ponto de Venda ultra-rápido ao controle cirúrgico de estoque e do marketing digital. Centralize tudo com a plataforma mais imersiva do mercado.",
        "en": "From ultra-fast POS to surgical inventory control and digital marketing. Centralize everything with the most immersive platform on the market.",
        "es": "Desde TPV ultrarrápido hasta control quirúrgico de inventario. Centraliza todo con la plataforma más inmersiva del mercado.",
        "fr": "Du point de vente ultra-rapide au contrôle des stocks chirurgical et au marketing numérique. Centralisez tout avec la plateforme la plus immersive du marché.",
        "it": "Dal POS ultraveloce al controllo chirurgico delle scorte. Centralizza tutto con la piattaforma più coinvolgente del mercato.",
        "de": "Von ultraschnellem POS bis zur chirurgischen Bestandskontrolle. Zentralisieren Sie alles mit der immersivsten Plattform auf dem Markt."
    },
    "home.tryNow": {
        "pt-BR": "Comece Gratuitamente",
        "en": "Start for Free",
        "es": "Comienza Gratis",
        "fr": "Commencez gratuitement",
        "it": "Inizia Gratis",
        "de": "Kostenlos starten"
    },
    "home.seePlans": {
        "pt-BR": "Conheça os Planos",
        "en": "See Pricing Plans",
        "es": "Conoce los Planes",
        "fr": "Voir les forfaits",
        "it": "Vedi i Piani",
        "de": "Preise ansehen"
    },
    "home.stats.sales": { "pt-BR": "40%", "en": "40%", "es": "40%", "fr": "40%", "it": "40%", "de": "40%" },
    "home.stats.salesLabel": {
        "pt-BR": "Aumento em Vendas",
        "en": "Increase in Sales",
        "es": "Aumento de Ventas",
        "fr": "Augmentation des ventes",
        "it": "Aumento delle Vendite",
        "de": "Umsatzsteigerung"
    },
    "home.stats.time": { "pt-BR": "15x", "en": "15x", "es": "15x", "fr": "15x", "it": "15x", "de": "15x" },
    "home.stats.timeLabel": {
        "pt-BR": "Menos Tempo em Fechamento",
        "en": "Less Time at Closing",
        "es": "Menos Tiempo en Cierre",
        "fr": "Moins de temps de clôture",
        "it": "Meno Tempo di Chiusura",
        "de": "Weniger Zeit beim Abschluss"
    },
    "home.stats.waste": {
        "pt-BR": "Zero", "en": "Zero", "es": "Cero", "fr": "Zéro", "it": "Zero", "de": "Null"
    },
    "home.stats.wasteLabel": {
        "pt-BR": "Desperdício de Estoque",
        "en": "Inventory Waste",
        "es": "Desperdicio de Inventario",
        "fr": "Gaspillage d'inventaire",
        "it": "Spreco di Inventario",
        "de": "Bestandsverschwendung"
    },
    "home.stats.support": { "pt-BR": "24/7", "en": "24/7", "es": "24/7", "fr": "24/7", "it": "24/7", "de": "24/7" },
    "home.stats.supportLabel": {
        "pt-BR": "Suporte Dedicado",
        "en": "Dedicated Support",
        "es": "Soporte Dedicado",
        "fr": "Support Dédié",
        "it": "Supporto Dedicato",
        "de": "Engagierter Support"
    },

    "home.featuresIntro.title": {
        "pt-BR": "Tudo que o seu negócio precisa",
        "en": "Everything your business needs",
        "es": "Todo lo que su negocio necesita",
        "fr": "Tout ce dont votre entreprise a besoin",
        "it": "Tutto ciò di cui il tuo business ha bisogno",
        "de": "Alles was Ihr Geschäft braucht"
    },
    "home.featuresIntro.highlight": {
        "pt-BR": "em um só lugar.",
        "en": "in one place.",
        "es": "en un solo lugar.",
        "fr": "au même endroit.",
        "it": "in un solo posto.",
        "de": "an einem Ort."
    },
    "home.featuresIntro.desc": {
        "pt-BR": "Esqueça assinar 5 sistemas diferentes que não conversam entre si. Construímos uma central de inteligência para o dono de restaurante focar no que importa.",
        "en": "Forget paying for 5 different systems. We built an intelligence center for restaurant owners to focus on what matters.",
        "es": "Olvida pagar por 5 sistemas diferentes. Construimos un centro de inteligencia para que el dueño se enfoque en lo que importa.",
        "fr": "Oubliez de payer pour 5 systèmes qui ne se parlent pas. Nous avons construit un centre d'intelligence pour le restaurateur.",
        "it": "Dimentica di pagare 5 sistemi diversi. Abbiamo costruito un centro di intelligenza per farti concentrare su ciò che conta.",
        "de": "Vergessen Sie die Bezahlung für 5 verschiedene Systeme. Wir haben ein Intelligenzzentrum für Restaurantbesitzer gebaut."
    },

    "home.feature1.title": {
        "pt-BR": "Ponto de Venda (PDV) Rápido", "en": "Fast Point of Sale (POS)", "es": "Punto de Venta Rápido", "fr": "Point de vente rapide", "it": "Punto Vendita Veloce", "de": "Schneller Kassensystem"
    },
    "home.feature1.desc": {
        "pt-BR": "Frente de caixa ultra-rápida. Gerencie comandas e pagamentos em segundos.",
        "en": "Ultra-fast checkout. Manage orders and payments in seconds.",
        "es": "Frente de caja ultrarrápido. Gestiona comandas y pagos en segundos.",
        "fr": "Caisse ultra-rapide. Gérez les commandes et les paiements en quelques secondes.",
        "it": "Checkout ultraveloce. Gestisci comande e pagamenti in pochi secondi.",
        "de": "Ultraschneller Checkout. Verwalten Sie Bestellungen und Zahlungen in Sekunden."
    },
    "home.feature2.title": {
        "pt-BR": "Cardápio QR Code Dinâmico", "en": "Dynamic QR Code Menu", "es": "Menú QR Dinámico", "fr": "Menu QR Dynamique", "it": "Menu QR Dinamico", "de": "Dynamisches QR-Menü"
    },
    "home.feature2.desc": {
        "pt-BR": "O cliente acessa na mesa promoções em tempo real e você captura seus dados sem fricção.",
        "en": "Customers access real-time promotions at the table while you seamlessly capture data.",
        "es": "El cliente accede a promociones en tiempo real y tú capturas datos sin fricción.",
        "fr": "Le client accède aux promotions à table et vous capturez les données sans friction.",
        "it": "Il cliente accede alle promozioni al tavolo e tu acquisisci dati senza attriti.",
        "de": "Kunden greifen am Tisch auf Echtzeit-Werbeaktionen zu und Sie erfassen nahtlos Daten."
    },
    "home.feature3.title": {
        "pt-BR": "Gestão Avançada de Estoque", "en": "Advanced Inventory Management", "es": "Gestión de Inventario", "fr": "Gestion avancée des stocks", "it": "Gestione Base dell'Inventario", "de": "Erweiterte Bestandsverwaltung"
    },
    "home.feature3.desc": {
        "pt-BR": "Vendeu? O estoque deduz na hora via Ficha Técnica alertando reposições.",
        "en": "Sold an item? The stock deducts instantly via recipes, alerting low levels.",
        "es": "¿Vendiste? El stock se descuenta al instante mediante recetas.",
        "fr": "Vendu? Le stock est déduit instantanément via les fiches techniques.",
        "it": "Venduto? Lo stock viene detratto istantaneamente tramite le ricette.",
        "de": "Verkauft? Der Bestand wird sofort anhand von Rezepten abgezogen."
    },
    "home.feature4.title": {
        "pt-BR": "Dashboard e Fluxo de Caixa", "en": "Dashboard & Cash Flow", "es": "Dashboard y Flujo de Caja", "fr": "Tableau de bord et trésorerie", "it": "Dashboard e Flusso di Cassa", "de": "Dashboard & Cashflow"
    },
    "home.feature4.desc": {
        "pt-BR": "Gráficos das suas vendas, horários de pico e lucro. Decisões guiadas por dados.",
        "en": "Charts of your sales, peak hours and profits. Data-driven decisions.",
        "es": "Gráficos de ventas, horas pico y beneficios. Decisiones basadas en datos.",
        "fr": "Graphiques de vos ventes et bénéfices. Décisions basées sur les données.",
        "it": "Grafici delle vendite e profitti. Decisioni basate sui dati.",
        "de": "Diagramme Ihrer Verkäufe und Gewinne. Datengesteuerte Entscheidungen."
    },
    "home.feature5.title": {
        "pt-BR": "Marketing CRM In-House", "en": "In-House CRM Marketing", "es": "Marketing CRM Propio", "fr": "CRM Marketing en Interne", "it": "CRM Marketing Interno", "de": "Hausinternes CRM Marketing"
    },
    "home.feature5.desc": {
        "pt-BR": "Envio de SMS para clientes ausentes ou ações de remarketing em 1 clique",
        "en": "Send SMS to missing customers or remarketing campaigns in 1 click.",
        "es": "Envía SMS a clientes inactivos o campañas en 1 clic.",
        "fr": "Envoi de SMS aux clients inactifs ou campagnes marketing en 1 clic.",
        "it": "Invia SMS ai clienti inattivi in 1 click.",
        "de": "Senden Sie SMS-Kampagnen an inaktive Kunden mit 1 Klick."
    },
    "home.feature6.title": {
        "pt-BR": "Para Qualquer Dispositivo", "en": "Accessible Anywhere", "es": "Accesible en Cualquier Dispositivo", "fr": "Accessible sur tous les appareils", "it": "Accessibile su Qualsiasi Dispositivo", "de": "Auf jedem Gerät zugänglich"
    },
    "home.feature6.desc": {
        "pt-BR": "Tablets, Celulares ou PCs. Sincronização em nuvem imbatível.",
        "en": "Tablets, phones, or PCs. Unbeatable cloud synchronization.",
        "es": "Tabletas, teléfonos o PC. Sincronización en la nube inmejorable.",
        "fr": "Tablettes ou PC. Synchronisation cloud imbattable.",
        "it": "Tablet, telefoni o PC. Sincronizzazione cloud imbattibile.",
        "de": "Tablets, Telefone oder PCs. Unschlagbare Cloud-Synchronisierung."
    },

    "home.showcase.badge": { "pt-BR": "Cardápio Inteligente", "en": "Smart Menu", "es": "Menú Inteligente", "fr": "Menu intelligent", "it": "Menu Intelligente", "de": "Intelligentes Menü" },
    "home.showcase.title": { "pt-BR": "Atraia mais clientes.\nVenda mais na mesa.", "en": "Attract more clients.\nSell more at the table.", "es": "Atrae más clientes.\nVende más en la mesa.", "fr": "Attirez plus de clients.\nVendez plus à table.", "it": "Attira più clienti.\nVendi di più al tavolo.", "de": "Ziehen Sie mehr Kunden an.\nVerkaufen Sie mehr am Tisch." },
    "home.showcase.item1": { "pt-BR": "Acesso rápido sem download de apps.", "en": "Fast access without downloading apps.", "es": "Acceso rápido sin descargar apps.", "fr": "Accès rapide sans téléchargement d'application.", "it": "Accesso veloce senza scaricare app.", "de": "Schneller Zugriff ohne App-Download." },
    "home.showcase.item2": { "pt-BR": "Upgrades sugeridos por nossa Inteligência.", "en": "Upgrades suggested by intelligence.", "es": "Upgrades sugeridos por la plataforma.", "fr": "Mises à niveau suggérées.", "it": "Upgrade suggeriti dalla piattaforma.", "de": "Vorgeschlagene Upgrades." },
    "home.showcase.item3": { "pt-BR": "Captura de dados para SMS Marketing.", "en": "Data capture for SMS marketing.", "es": "Captura de datos para Marketing SMS.", "fr": "Capture de données pour SMS Marketing.", "it": "Acquisizione dati per SMS Marketing.", "de": "Datenerfassung für SMS Marketing." },
    "home.showcase.item4": { "pt-BR": "Aumenta seu Ticket Médio.", "en": "Increases your Average Ticket.", "es": "Aumenta el ticket promedio.", "fr": "Augmente votre ticket moyen.", "it": "Aumenta lo scontrino medio.", "de": "Erhöht Ihren Durchschnitts-Bon." },
    "home.showcase.button": { "pt-BR": "Ver Demonstração do QR", "en": "See QR Demo", "es": "Ver Demo QR", "fr": "Voir la démo QR", "it": "Vedi Demo QR", "de": "QR-Demo ansehen" },

    "home.finalcta.title": {
        "pt-BR": "Pronto para assumir o controle total?",
        "en": "Ready to take full control?",
        "es": "¿Listo para asumir el control total?",
        "fr": "Prêt à prendre le contrôle total?",
        "it": "Pronto a prendere il controllo totale?",
        "de": "Bereit, die volle Kontrolle zu übernehmen?"
    },
    "home.finalcta.desc": {
        "pt-BR": "Junte-se a donos de restaurantes que economizam dezenas de horas com inteligência unificada.",
        "en": "Join restaurant owners saving dozens of hours with unified intelligence.",
        "es": "Únete a dueños de restaurantes que ahorran docenas de horas.",
        "fr": "Rejoignez les restaurateurs qui gagnent des dizaines d'heures.",
        "it": "Unisciti ai ristoratori che risparmiano decine di ore.",
        "de": "Schließen Sie sich Gastronomen an, die durch vereinfachte Verwaltung Stunden sparen."
    },
    "home.finalcta.button": {
        "pt-BR": "Criar Minha Conta Grátis",
        "en": "Create Free Account",
        "es": "Crear Cuenta Gratis",
        "fr": "Créer mon compte gratuit",
        "it": "Crea Account Gratuito",
        "de": "Kostenloses Konto erstellen"
    },

    // --- PLANS PAGE REDESIGN ---
    "plans.heroBadge": {
        "pt-BR": "Pré-Lançamento VIP", "en": "VIP Pre-Launch", "es": "Pre-Lanzamiento", "fr": "Pré-lancement VIP", "it": "Pre-Lancio VIP", "de": "VIP Pre-Launch"
    },
    "plans.heroTitleLine1": {
        "pt-BR": "Invista menos do que", "en": "Invest less than", "es": "Invierte menos", "fr": "Investissez moins que", "it": "Investi meno", "de": "Investieren Sie weniger"
    },
    "plans.heroTitleLine2": {
        "pt-BR": "você gasta com", "en": "what you spend on", "es": "de lo que gastas en", "fr": "ce que vous dépensez en", "it": "di quello che spendi in", "de": "als Sie ausgeben für"
    },
    "plans.heroTitleLine3": {
        "pt-BR": "papinha de bobina.", "en": "receipt paper.", "es": "papel de recibos.", "fr": "rouleaux de caisse.", "it": "rotoli di carta.", "de": "Quittungspapier."
    },
    "plans.heroDesc": {
        "pt-BR": "Escolha o plano ideal para a sua operação. Migre ou cancele a qualquer momento. Sem amarras.",
        "en": "Choose the ideal plan for your operation. Upgrade or cancel anytime. No strings attached.",
        "es": "Elige el plan ideal para tu operación. Pasa o cancela en cualquier momento. Sin ataduras.",
        "fr": "Choisissez le forfait idéal. Annulez à tout moment. Sans engagement.",
        "it": "Scegli il piano ideale per te. Aggiorna o annulla in qualsiasi momento. Senza vincoli.",
        "de": "Wählen Sie den idealen Plan für Ihren Betrieb. Jederzeit anpassen oder kündigen. Keine Bindung."
    },

    "plans.features.pos1": { "pt-BR": "1 Ponto de Venda (PDV)", "en": "1 POS Terminal", "es": "1 Punto de Venta (TPV)", "fr": "1 Caisse Enregistreuse", "it": "1 Punto Vendita (POS)", "de": "1 POS-Terminal" },
    "plans.features.inventoryBase": { "pt-BR": "Gestão de Estoque Básica", "en": "Basic Inventory Management", "es": "Gestión Básica de Inventario", "fr": "Gestion de stock basique", "it": "Gestione Base Magazzino", "de": "Basis-Bestandsverwaltung" },
    "plans.features.menuProducts": { "pt-BR": "Até 50 Produtos no Cardápio", "en": "Up to 50 Menu Products", "es": "Hasta 50 Productos", "fr": "Jusqu'à 50 produits", "it": "Fino a 50 Prodotti", "de": "Bis zu 50 Produkte" },
    "plans.features.posInfinite": { "pt-BR": "PDVs Ilimitados", "en": "Unlimited POS Terminals", "es": "TPVs Ilimitados", "fr": "Caisses illimitées", "it": "POS Illimitati", "de": "Unbegrenzte POS-Terminals" },
    "plans.features.qrMenu": { "pt-BR": "Cardápio QR Code Dinâmico", "en": "Dynamic QR Menu", "es": "Menú QR Dinámico", "fr": "Menu QR", "it": "Menu QR Dinamico", "de": "Dynamisches QR-Menü" },
    "plans.features.inventoryInfinite": { "pt-BR": "Estoque Integrado Ilimitado", "en": "Unlimited Integrated Inventory", "es": "Inventario Ilimitado", "fr": "Stock illimité intégré", "it": "Scorte Illimitate Integrate", "de": "Unbegrenztes Integriertes Inventar" },
    "plans.features.dashboard": { "pt-BR": "Dashboard de Vendas Local", "en": "Local Sales Dashboard", "es": "Dashboard de Ventas", "fr": "Tableau de bord local", "it": "Dashboard delle Vendite", "de": "Lokales Verkaufs-Dashboard" },
    "plans.features.smsMarketing": { "pt-BR": "Disparos de SMS e Automação", "en": "SMS Marketing Automation", "es": "Automatización SMS", "fr": "Automatisation SMS", "it": "Automazione SMS Marketing", "de": "SMS-Marketing-Automatisierung" },
    "plans.features.cashflow": { "pt-BR": "Central Financeira (Em Breve)", "en": "Finance Hub (Coming Soon)", "es": "Centro Financiero (Pronto)", "fr": "Hub Financier (Bientôt)", "it": "Centro Finanziario (Presto)", "de": "Finance Hub (Demnächst)" },
    "plans.features.ai": { "pt-BR": "Análises de IA Proprietárias", "en": "Proprietary AI Analytics", "es": "Análisis IA", "fr": "Analytique IA", "it": "Analitica IA Proprietaria", "de": "Eigene KI-Analysen" },
    "plans.features.manager": { "pt-BR": "Gerente Exclusivo via WhatsApp", "en": "VIP Account Manager", "es": "Gerente VIP", "fr": "Account Manager VIP", "it": "Manager Account VIP", "de": "VIP-Kundenbetreuer" },

    "plans.safety.cancel": { "pt-BR": "Cancelamento Livre", "en": "Free Cancellation", "es": "Cancelación Libre", "fr": "Annulation gratuite", "it": "Cancellazione Gratuita", "de": "Kostenlose Stornierung" },
    "plans.safety.nocontract": { "pt-BR": "Sem contratos absurdos.", "en": "No absurd contracts.", "es": "Sin contratos.", "fr": "Pas de contrats.", "it": "Senza contratti.", "de": "Kein Vertragsbindung." },
    "plans.safety.setup": { "pt-BR": "Setup Express", "en": "Express Setup", "es": "Setup Exprés", "fr": "Mise en place express", "it": "Setup Espresso", "de": "Express-Einrichtung" },
    "plans.safety.minutes": { "pt-BR": "Seu negócio online em 5 min.", "en": "Online in 5 minutes.", "es": "Online en 5 min.", "fr": "En ligne en 5 minutes.", "it": "Online in 5 min.", "de": "In 5 Minuten online." }
};

for (const lang of languages) {
    const filePath = path.join(localesDir, `${lang}.json`);
    if (!fs.existsSync(filePath)) {
        console.warn(`Locale ${lang} not found, skipping.`);
        continue;
    }

    let content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Replace strings
    for (const [key, mapping] of Object.entries(newKeys)) {
        if (mapping[lang]) {
            content[key] = mapping[lang];
        } else {
            // fallback to PT or EN
            content[key] = mapping['pt-BR'] || mapping['en'];
        }
    }

    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    console.log(`Updated ${lang}.json`);
}
