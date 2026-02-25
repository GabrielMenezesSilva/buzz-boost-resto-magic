const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');

const newKeys = {
  'nav.profile': { 'pt-BR': 'Meu Perfil', 'en': 'My Profile', 'es': 'Mi Perfil', 'fr': 'Mon Profil', 'it': 'Il Mio Profilo', 'de': 'Mein Profil' },
  'nav.settings': { 'pt-BR': 'Configurações', 'en': 'Settings', 'es': 'Configuración', 'fr': 'Paramètres', 'it': 'Impostazioni', 'de': 'Einstellungen' },
  'nav.currentPlan': { 'pt-BR': 'Plano Atual', 'en': 'Current Plan', 'es': 'Plan Actual', 'fr': 'Forfait Actuel', 'it': 'Piano Attuale', 'de': 'Aktueller Plan' },
  'nav.helpSupport': { 'pt-BR': 'Ajuda & Suporte', 'en': 'Help & Support', 'es': 'Ayuda y Soporte', 'fr': 'Aide et Support', 'it': 'Aiuto & Supporto', 'de': 'Hilfe & Support' }
};

['pt-BR.json', 'en.json', 'es.json', 'fr.json', 'it.json', 'de.json'].forEach(file => {
  const filePath = path.join(localesDir, file);
  if (fs.existsSync(filePath)) {
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const langKey = file.split('.')[0];
    
    for (const [key, translations] of Object.entries(newKeys)) {
      if (!json[key]) json[key] = translations[langKey] || translations['en'];
    }
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
  }
});

console.log('Dropdown Menu i18n Injection Completed!');
