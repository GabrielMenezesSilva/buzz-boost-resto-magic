import fs from 'node:fs';
import path from 'node:path';

const localesDir = path.join(process.cwd(), 'src', 'locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

const tr = {
    "pt-BR": {
        "products.batch": "Lote (Opcional)",
        "products.expiry": "Validade (Opcional)"
    },
    "en": {
        "products.batch": "Batch (Optional)",
        "products.expiry": "Expiry Date (Optional)"
    },
    "es": {
        "products.batch": "Lote (Opcional)",
        "products.expiry": "Vencimiento (Opcional)"
    },
    "de": {
        "products.batch": "Charge (Optional)",
        "products.expiry": "Verfallsdatum (Optional)"
    },
    "fr": {
        "products.batch": "Lot (Optionnel)",
        "products.expiry": "Date d'expiration (Optionnel)"
    },
    "it": {
        "products.batch": "Lotto (Opzionale)",
        "products.expiry": "Scadenza (Opzionale)"
    }
};

files.forEach(file => {
    const filePath = path.join(localesDir, file);
    const lang = file.replace('.json', '');

    if (tr[lang]) {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const db = JSON.parse(rawData);

        Object.keys(tr[lang]).forEach(key => {
            db[key] = tr[lang][key];
        });

        fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf-8');
        console.log(`Updated translations for ${file}`);
    }
});

console.log('Batch/Expiry translations injected!');
