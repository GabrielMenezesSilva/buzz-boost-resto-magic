const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');

const keysEs = {
    "plans.starterSubtitle": "Para probar el impacto en tu sala",
    "plans.starterDesc": "Lo esencial para modernizar tu operación sin costo inicial.",
    "plans.startFree": "Comenzar Gratis",

    "plans.professionalSubtitle": "El motor completo para multiplicar ganancias",
    "plans.professionalDesc": "Todas las herramientas avanzadas en piloto automático.",
    "plans.upgradeNow": "Escalar mis Ventas",

    "plans.premium": "Scale",
    "plans.premiumSubtitle": "Para una expansión agresiva",
    "plans.premiumDesc": "Inteligencia artificial y soporte VIP dedicado.",
    "plans.choosePlan": "Hablar con un Experto",

    "plans.heroBadge": "Libera el Potencial de tu Negocio",
    "plans.heroTitleLine1": "Deja de perder dinero",
    "plans.heroTitleLine2": "con sistemas",
    "plans.heroTitleLine3": "obsoletos.",
    "plans.heroDesc": "Elige el plan perfecto para tu operación. Desde lo básico hasta lo ultra avanzado, sin ataduras."
};

const keysFr = {
    "plans.starterSubtitle": "Pour tester l'impact sur votre salle",
    "plans.starterDesc": "L'essentiel pour moderniser votre opération sans coût.",
    "plans.startFree": "Commencer gratuitement",

    "plans.professionalSubtitle": "Le moteur complet pour multiplier les profits",
    "plans.professionalDesc": "Tous les outils avancés en pilote automatique.",
    "plans.upgradeNow": "Augmenter mes ventes",

    "plans.premium": "Scale",
    "plans.premiumSubtitle": "Pour une expansion agressive",
    "plans.premiumDesc": "Intelligence artificielle et support VIP dédié.",
    "plans.choosePlan": "Parler à un expert",

    "plans.heroBadge": "Libérez le potentiel de votre entreprise",
    "plans.heroTitleLine1": "Cessez de perdre de l'argent",
    "plans.heroTitleLine2": "avec des systèmes",
    "plans.heroTitleLine3": "dépassés.",
    "plans.heroDesc": "Choisissez le forfait idéal pour votre établissement. Du basique à l'ultra-avancé, sans engagement."
};

const keysIt = {
    "plans.starterSubtitle": "Per testare l'impatto nella tua sala",
    "plans.starterDesc": "L'essenziale per modernizzare la tua operazione a costo zero.",
    "plans.startFree": "Inizia Gratis",

    "plans.professionalSubtitle": "Il motore completo per moltiplicare i profitti",
    "plans.professionalDesc": "Tutti gli strumenti avanzati con il pilota automatico.",
    "plans.upgradeNow": "Aumenta le mie Vendite",

    "plans.premium": "Scale",
    "plans.premiumSubtitle": "Per un'espansione aggressiva",
    "plans.premiumDesc": "Intelligenza artificiale e supporto VIP dedicato.",
    "plans.choosePlan": "Parla con un Esperto",

    "plans.heroBadge": "Sblocca il Potenziale del tuo Business",
    "plans.heroTitleLine1": "Smetti di perdere soldi",
    "plans.heroTitleLine2": "con sistemi",
    "plans.heroTitleLine3": "obsoleti.",
    "plans.heroDesc": "Scegli il piano perfetto per la tua attività. Dal base all'ultra-avanzato, senza vincoli."
};

const keysDe = {
    "plans.starterSubtitle": "Um die Auswirkungen auf Ihren Saal zu testen",
    "plans.starterDesc": "Das Wesentliche, um Ihren Betrieb ohne Kosten zu modernisieren.",
    "plans.startFree": "Kostenlos starten",

    "plans.professionalSubtitle": "Der komplette Motor zur Gewinnsteigerung",
    "plans.professionalDesc": "Alle fortschrittlichen Werkzeuge auf Autopilot.",
    "plans.upgradeNow": "Meine Verkäufe steigern",

    "plans.premium": "Scale",
    "plans.premiumSubtitle": "Für aggressive Expansion",
    "plans.premiumDesc": "Künstliche Intelligenz und engagierter VIP-Support.",
    "plans.choosePlan": "Mit einem Experten sprechen",

    "plans.heroBadge": "Schöpfen Sie Ihr Geschäftspotenzial aus",
    "plans.heroTitleLine1": "Hören Sie auf, Geld",
    "plans.heroTitleLine2": "mit veralteten",
    "plans.heroTitleLine3": "Systemen zu verlieren.",
    "plans.heroDesc": "Wählen Sie den perfekten Plan für Ihren Betrieb. Von der Basis- bis zur Ultra-Advanced-Version, ohne Bindung."
};

function update(lang, data) {
    const filePath = path.join(localesDir, `${lang}.json`);
    if (!fs.existsSync(filePath)) return;
    let content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    for (const [key, val] of Object.entries(data)) {
        content[key] = val;
    }
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
}

update('es', keysEs);
update('fr', keysFr);
update('it', keysIt);
update('de', keysDe);
