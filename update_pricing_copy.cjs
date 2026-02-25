const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');

const newPtBR = {
    "plans.starter": "Starter",
    "plans.starterSubtitle": "Para testar o impacto no seu salão",
    "plans.starterDesc": "O essencial para modernizar sua operação sem custo inicial.",
    "plans.startFree": "Começar Grátis",

    "plans.professional": "Pro",
    "plans.professionalSubtitle": "O motor completo para multiplicar lucros",
    "plans.professionalDesc": "Todas as ferramentas avançadas no piloto automático.",
    "plans.upgradeNow": "Escalar Minhas Vendas",

    "plans.premium": "Scale",
    "plans.premiumSubtitle": "Para expansão agressiva",
    "plans.premiumDesc": "Inteligência artificial e suporte VIP dedicado.",
    "plans.choosePlan": "Falar com Especialista",

    "plans.heroBadge": "Libere o Potencial do seu Restaurante",
    "plans.heroTitleLine1": "Pare de perder dinheiro",
    "plans.heroTitleLine2": "com sistemas",
    "plans.heroTitleLine3": "ultrapassados.",
    "plans.heroDesc": "Escolha o plano perfeito para o momento da sua operação. Do básico ao ultra-avançado, sem amarras operacionais."
};

const newEn = {
    "plans.starter": "Starter",
    "plans.starterSubtitle": "To test the impact on your floor",
    "plans.starterDesc": "The essentials to modernize your operation at no initial cost.",
    "plans.startFree": "Start for Free",

    "plans.professional": "Pro",
    "plans.professionalSubtitle": "The complete engine to multiply profits",
    "plans.professionalDesc": "All advanced tools running on autopilot.",
    "plans.upgradeNow": "Scale My Sales",

    "plans.premium": "Scale",
    "plans.premiumSubtitle": "For aggressive expansion",
    "plans.premiumDesc": "Artificial intelligence and dedicated VIP support.",
    "plans.choosePlan": "Talk to an Expert",

    "plans.heroBadge": "Unlock Your Business Potential",
    "plans.heroTitleLine1": "Stop losing money",
    "plans.heroTitleLine2": "with outdated",
    "plans.heroTitleLine3": "systems.",
    "plans.heroDesc": "Choose the perfect plan for your operation. From basic to ultra-advanced, with no lock-ins."
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

update('pt-BR', newPtBR);
update('en', newEn);
['es', 'it', 'fr', 'de'].forEach(lang => update(lang, newEn));
