const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');

const dict = {
    'publicForm.emailLabel': { 'pt-BR': 'E-mail', 'en': 'Email', 'es': 'Correo electrónico', 'fr': 'E-mail', 'it': 'E-mail', 'de': 'E-Mail' }
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

console.log('Dictionaries populated with email required key!');
