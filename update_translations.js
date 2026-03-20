import fs from 'node:fs';
import path from 'node:path';

const localesDir = path.join(process.cwd(), 'src', 'locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

const badges = {
    "pt-BR": "Libere o Potencial",
    "en": "Unlock Potential",
    "de": "Potenzial freisetzen",
    "es": "Libera el Potencial",
    "fr": "Libérez le Potentiel",
    "it": "Sblocca il Potenziale"
};

files.forEach(file => {
    const filePath = path.join(localesDir, file);
    const lang = file.replace('.json', '');

    if (badges[lang]) {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const existingTranslations = JSON.parse(rawData);

        // Merge
        existingTranslations['plans.heroBadge'] = badges[lang];

        fs.writeFileSync(filePath, JSON.stringify(existingTranslations, null, 2), 'utf-8');
        console.log(`Updated native badge translation for ${file}`);
    }
});

console.log('Hero badges added to all 6 languages!');
