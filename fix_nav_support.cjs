const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const files = {
  'pt-BR.json': { 'nav.support': 'Suporte', 'nav.plans': 'Planos', 'nav.home': 'Início' },
  'en.json': { 'nav.support': 'Support', 'nav.plans': 'Plans', 'nav.home': 'Home' },
  'es.json': { 'nav.support': 'Soporte', 'nav.plans': 'Planes', 'nav.home': 'Inicio' },
  'fr.json': { 'nav.support': 'Support', 'nav.plans': 'Plans', 'nav.home': 'Accueil' }
};

for (const [file, translations] of Object.entries(files)) {
  const filePath = path.join(localesDir, file);
  if (fs.existsSync(filePath)) {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(rawData);
    
    // Add missing nav keys
    for (const [key, value] of Object.entries(translations)) {
        if (!json[key]) {
            json[key] = value;
        }
    }
    // force update nav.support
    json['nav.support'] = translations['nav.support'];
    
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
    console.log(`Updated ${file} with nav.support`);
  }
}
