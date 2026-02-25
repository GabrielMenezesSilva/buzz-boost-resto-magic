const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');

const dict = {
    'publicForm.takeScreenshot': {
        'pt-BR': 'Tire um print ou mostre esta tela para um funcionário para receber seu brinde!',
        'en': 'Take a screenshot or show this screen to an employee to receive your reward!',
        'es': '¡Tome una captura de pantalla o muestre esta pantalla a un empleado para recibir su recompensa!',
        'fr': 'Prenez une capture d\'écran ou montrez cet écran à un employé pour recevoir votre récompense !',
        'it': 'Fai uno screenshot o mostra questa schermata a un dipendente per ricevere il tuo premio!',
        'de': 'Machen Sie einen Screenshot oder zeigen Sie diesen Bildschirm einem Mitarbeiter, um Ihre Belohnung zu erhalten!'
    }
};

['pt-BR.json', 'en.json', 'es.json', 'fr.json', 'it.json', 'de.json'].forEach(file => {
    const filePath = path.join(localesDir, file);
    if (fs.existsSync(filePath)) {
        const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const langKey = file.split('.')[0];

        for (const [key, translations] of Object.entries(dict)) {
            json[key] = translations[langKey] || translations['en'];
        }
        fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
    }
});

console.log('Dictionaries populated with updated screenshot instructions!');
