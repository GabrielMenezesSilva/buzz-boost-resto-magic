const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');

const dict = {
    'publicForm.redeemedAt': { 'pt-BR': 'Resgatado em:', 'en': 'Redeemed at:', 'es': 'Canjeado el:', 'fr': 'Réclamé le :', 'it': 'Riscattato il:', 'de': 'Eingelöst am:' },
    'publicForm.at': { 'pt-BR': 'às', 'en': 'at', 'es': 'a las', 'fr': 'à', 'it': 'alle', 'de': 'um' }
};

['pt-BR.json', 'en.json', 'es.json', 'fr.json', 'it.json', 'de.json'].forEach(file => {
    const filePath = path.join(localesDir, file);
    if (fs.existsSync(filePath)) {
        const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const langKey = file.split('.')[0];

        for (const [key, translations] of Object.entries(dict)) {
            if (!json[key]) json[key] = translations[langKey] || translations['en'];
        }
        fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
    }
});

console.log('Dictionaries populated with timestamp keys!');
