const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const pagesDir = path.join(__dirname, 'src', 'pages');

// Map of missing translations for the 4 explicit languages
const newKeys = {
  'campaigns.sms': { 'pt-BR': 'SMS', 'en': 'SMS', 'es': 'SMS', 'fr': 'SMS', 'it': 'SMS', 'de': 'SMS' },
  'campaigns.whatsapp': { 'pt-BR': 'WhatsApp', 'en': 'WhatsApp', 'es': 'WhatsApp', 'fr': 'WhatsApp', 'it': 'WhatsApp', 'de': 'WhatsApp' },
  'campaigns.email': { 'pt-BR': 'E-mail', 'en': 'Email', 'es': 'Correo', 'fr': 'E-mail', 'it': 'E-mail', 'de': 'E-Mail' },
  'profile.phonePlaceholder': { 'pt-BR': '(11) 99999-9999', 'en': '(555) 123-4567', 'es': '(555) 123-4567', 'fr': '06 12 34 56 78', 'it': '320 123 4567', 'de': '0151 12345678' },
  'settings.personalize': { 'pt-BR': 'Personalize sua experiência no DopplerDine', 'en': 'Personalize your DopplerDine experience', 'es': 'Personaliza tu experiencia en DopplerDine', 'fr': 'Personnalisez votre expérience DopplerDine', 'it': 'Personalizza la tua esperienza DopplerDine', 'de': 'Personalisieren Sie Ihr DopplerDine-Erlebnis' },
  'settings.themeLabel': { 'pt-BR': 'Tema', 'en': 'Theme', 'es': 'Tema', 'fr': 'Thème', 'it': 'Tema', 'de': 'Thema' },
  'settings.languageLabel': { 'pt-BR': 'Idioma', 'en': 'Language', 'es': 'Idioma', 'fr': 'Langue', 'it': 'Lingua', 'de': 'Sprache' },
  'settings.langPt': { 'pt-BR': '🇧🇷 Português (Brasil)', 'en': '🇧🇷 Portuguese (Brazil)', 'es': '🇧🇷 Portugués (Brasil)', 'fr': '🇧🇷 Portugais (Brésil)', 'it': '🇧🇷 Portoghese (Brasile)', 'de': '🇧🇷 Portugiesisch (Brasilien)' },
  'settings.langEn': { 'pt-BR': '🇺🇸 Inglês (EUA)', 'en': '🇺🇸 English (US)', 'es': '🇺🇸 Inglés (EE.UU.)', 'fr': '🇺🇸 Anglais (US)', 'it': '🇺🇸 Inglese (US)', 'de': '🇺🇸 Englisch (US)' },
  'settings.langEs': { 'pt-BR': '🇪🇸 Espanhol (Espanha)', 'en': '🇪🇸 Spanish (Spain)', 'es': '🇪🇸 Español (España)', 'fr': '🇪🇸 Espagnol (Espagne)', 'it': '🇪🇸 Spagnolo (Spagna)', 'de': '🇪🇸 Spanisch (Spanien)' },
  'settings.langFr': { 'pt-BR': '🇫🇷 Francês (França)', 'en': '🇫🇷 French (France)', 'es': '🇫🇷 Francés (Francia)', 'fr': '🇫🇷 Français (France)', 'it': '🇫🇷 Francese (Francia)', 'de': '🇫🇷 Französisch (Frankreich)' },
  'categories.placeholder1': { 'pt-BR': 'Ex: Bebidas, Carnes...', 'en': 'Ex: Drinks, Meats...', 'es': 'Ej: Bebidas, Carnes...', 'fr': 'Ex: Boissons, Viandes...', 'it': 'Es: Bevande, Carni...', 'de': 'Z.B. Getränke, Fleisch...' },
  'categories.placeholder2': { 'pt-BR': '...', 'en': '...', 'es': '...', 'fr': '...', 'it': '...', 'de': '...' },
  'products.placeholder1': { 'pt-BR': 'Ex: Coca-Cola 2L, Hamburguer Artesanal...', 'en': 'Ex: Coke 2L, Craft Burger...', 'es': 'Ej: Coca-Cola 2L, Hamburguesa Artesanal...', 'fr': 'Ex: Coca-Cola 2L, Burger Artisanal...', 'it': 'Es: Coca-Cola 2L, Hamburger Artigianale...', 'de': 'Z.B. Cola 2L, Craft Burger...' },
  'products.selectPlaceholder': { 'pt-BR': 'Selecione...', 'en': 'Select...', 'es': 'Seleccionar...', 'fr': 'Sélectionner...', 'it': 'Seleziona...', 'de': 'Auswählen...' },
  'suppliers.placeholder1': { 'pt-BR': 'Ex: Coca-Cola, Hortifruti do Bairro', 'en': 'Ex: Coca-Cola, Local Produce', 'es': 'Ej: Coca-Cola, Verdulería Local', 'fr': 'Ex: Coca-Cola, Producteur Local', 'it': 'Es: Coca-Cola, Fruttivendolo Locale', 'de': 'Z.B. Coca-Cola, Lokaler Gemüsehändler' },
  'suppliers.placeholder2': { 'pt-BR': 'Ex: João da Silva', 'en': 'Ex: John Doe', 'es': 'Ej: Juan Pérez', 'fr': 'Ex: Jean Dupont', 'it': 'Es: Mario Rossi', 'de': 'Z.B. Max Mustermann' },
  'suppliers.placeholder3': { 'pt-BR': '(11) 98765-4321', 'en': '(555) 987-6543', 'es': '(555) 987-6543', 'fr': '06 98 76 54 32', 'it': '333 987 6543', 'de': '0160 98765432' },
  'suppliers.placeholder4': { 'pt-BR': 'contato@empresa.com', 'en': 'contact@company.com', 'es': 'contacto@empresa.com', 'fr': 'contact@entreprise.com', 'it': 'contatto@azienda.com', 'de': 'kontakt@firma.com' },
  'suppliers.placeholder5': { 'pt-BR': 'Dias de entrega, pedido mínimo...', 'en': 'Delivery days, minimum order...', 'es': 'Días de entrega, pedido mínimo...', 'fr': 'Jours de livraison, commande minimum...', 'it': 'Giorni di consegna, ordine minimo...', 'de': 'Liefertage, Mindestbestellmenge...' }
};

// Update Locales JSON files
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

// Update Components TSX Replacements
const replacements = [
  { file: 'Campaigns.tsx', search: />SMS</g, replace: ">{t('campaigns.sms')}<" },
  { file: 'Campaigns.tsx', search: />WhatsApp</g, replace: ">{t('campaigns.whatsapp')}<" },
  { file: 'Campaigns.tsx', search: />Email</g, replace: ">{t('campaigns.email')}<" },
  
  { file: 'Profile.tsx', search: /placeholder="\(11\) 99999-9999"/g, replace: "placeholder={t('profile.phonePlaceholder')}" },
  
  { file: 'Settings.tsx', search: />Personalize sua experiência no DopplerDine</g, replace: ">{t('settings.personalize')}<" },
  { file: 'Settings.tsx', search: />Tema</g, replace: ">{t('settings.themeLabel')}<" },
  { file: 'Settings.tsx', search: />Idioma</g, replace: ">{t('settings.languageLabel')}<" },
  { file: 'Settings.tsx', search: />🇧🇷 Português \(Brasil\)</g, replace: ">{t('settings.langPt')}<" },
  { file: 'Settings.tsx', search: />🇺🇸 English \(US\)</g, replace: ">{t('settings.langEn')}<" },
  { file: 'Settings.tsx', search: />🇪🇸 Español \(España\)</g, replace: ">{t('settings.langEs')}<" },
  { file: 'Settings.tsx', search: />🇫🇷 Français \(France\)</g, replace: ">{t('settings.langFr')}<" },
  
  { file: 'Categories.tsx', search: /placeholder="Ex: Bebidas, Carnes..."/g, replace: "placeholder={t('categories.placeholder1')}" },
  { file: 'Categories.tsx', search: /placeholder="\.\.\."/g, replace: "placeholder={t('categories.placeholder2')}" },
  
  { file: 'Products.tsx', search: /placeholder="Ex: Coca-Cola 2L, Hamburguer Artesanal..."/g, replace: "placeholder={t('products.placeholder1')}" },
  { file: 'Products.tsx', search: /placeholder="Selecione..."/g, replace: "placeholder={t('products.selectPlaceholder')}" },
  
  { file: 'Suppliers.tsx', search: /placeholder="Ex: Coca-Cola, Hortifruti do Bairro"/g, replace: "placeholder={t('suppliers.placeholder1')}" },
  { file: 'Suppliers.tsx', search: /placeholder="Ex: João da Silva"/g, replace: "placeholder={t('suppliers.placeholder2')}" },
  { file: 'Suppliers.tsx', search: /placeholder="\(11\) 98765-4321"/g, replace: "placeholder={t('suppliers.placeholder3')}" },
  { file: 'Suppliers.tsx', search: /placeholder="contato@empresa.com"/g, replace: "placeholder={t('suppliers.placeholder4')}" },
  { file: 'Suppliers.tsx', search: /placeholder="Dias de entrega, pedido mínimo..."/g, replace: "placeholder={t('suppliers.placeholder5')}" }
];

replacements.forEach(({ file, search, replace }) => {
  const filePath = path.join(pagesDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(search, replace);
    fs.writeFileSync(filePath, content, 'utf8');
  }
});

console.log('Batch i18n Injection and TSX Replacement Completed!');
