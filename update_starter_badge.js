import fs from 'node:fs';
import path from 'node:path';

const localesDir = path.join(process.cwd(), 'src', 'locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

const badges = {
    "pt-BR": "Mais Acessível",
    "en": "Most Accessible",
    "de": "Am Günstigsten",
    "es": "Más Accesible",
    "fr": "Le Plus Accessible",
    "it": "Più Accessibile"
};

files.forEach(file => {
    const filePath = path.join(localesDir, file);
    const lang = file.replace('.json', '');

    if (badges[lang]) {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const existingTranslations = JSON.parse(rawData);

        // Merge
        existingTranslations['plans.badge.starter'] = badges[lang];

        fs.writeFileSync(filePath, JSON.stringify(existingTranslations, null, 2), 'utf-8');
        console.log(`Updated native starter badge for ${file}`);
    }
});

console.log('Starter badges added to all 6 languages!');
