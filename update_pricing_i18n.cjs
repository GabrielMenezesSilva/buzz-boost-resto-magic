const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');

const keysPtBR = {
    "plans.monthly": "Mensal",
    "plans.annual": "Anual",
    "plans.save20": "Economize 20%",
    "plans.features.allPro": "Tudo do plano Pro",
    "plans.whatsIncluded": "O que está incluído",

    // Updating existing fallbacks with the new copy just in case
    "plans.safety.cancel": "Cancelamento Livre",
    "plans.safety.nocontract": "Sem letras miúdas ou multas.",
    "plans.safety.setup": "Onboarding VIP",
    "plans.safety.minutes": "Seu negócio rodando rápido."
};

const keysEn = {
    "plans.monthly": "Monthly",
    "plans.annual": "Annually",
    "plans.save20": "Save 20%",
    "plans.features.allPro": "Everything in Pro",
    "plans.whatsIncluded": "What's included",

    "plans.safety.cancel": "Risk-Free Cancelation",
    "plans.safety.nocontract": "No hidden fees or trap contracts.",
    "plans.safety.setup": "VIP Onboarding",
    "plans.safety.minutes": "Your business fully operational fast."
};

const keysEs = {
    "plans.monthly": "Mensual",
    "plans.annual": "Anual",
    "plans.save20": "Ahorra 20%",
    "plans.features.allPro": "Todo del plan Pro",
    "plans.whatsIncluded": "Qué incluye",

    "plans.safety.cancel": "Cancelación Libre",
    "plans.safety.nocontract": "Sin letras pequeñas ni multas.",
    "plans.safety.setup": "Onboarding VIP",
    "plans.safety.minutes": "Tu negocio operando rápido."
};

const keysFr = {
    "plans.monthly": "Mensuel",
    "plans.annual": "Annuel",
    "plans.save20": "Économisez 20%",
    "plans.features.allPro": "Tout dans Pro",
    "plans.whatsIncluded": "Ce qui est inclus",

    "plans.safety.cancel": "Annulation libre",
    "plans.safety.nocontract": "Sans frais cachés ni contrats.",
    "plans.safety.setup": "Intégration VIP",
    "plans.safety.minutes": "Votre entreprise en ligne rapidement."
};

const keysIt = {
    "plans.monthly": "Mensile",
    "plans.annual": "Annuale",
    "plans.save20": "Risparmia 20%",
    "plans.features.allPro": "Tutto del piano Pro",
    "plans.whatsIncluded": "Cosa è incluso",

    "plans.safety.cancel": "Cancellazione Libera",
    "plans.safety.nocontract": "Nessuna spesa nascosta o contratto.",
    "plans.safety.setup": "Onboarding VIP",
    "plans.safety.minutes": "Il tuo business online velocemente."
};

const keysDe = {
    "plans.monthly": "Monatlich",
    "plans.annual": "Jährlich",
    "plans.save20": "20% Sparen",
    "plans.features.allPro": "Alles in Pro",
    "plans.whatsIncluded": "Was ist enthalten",

    "plans.safety.cancel": "Risikofreie Stornierung",
    "plans.safety.nocontract": "Keine versteckten Gebühren oder Verträge.",
    "plans.safety.setup": "VIP Onboarding",
    "plans.safety.minutes": "Ihr Unternehmen schnell einsatzbereit."
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

update('pt-BR', keysPtBR);
update('en', keysEn);
update('es', keysEs);
update('fr', keysFr);
update('it', keysIt);
update('de', keysDe);
