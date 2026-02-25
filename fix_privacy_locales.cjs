const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const files = ['pt-BR.json', 'en.json', 'es.json', 'fr.json'];

const privacyMissing = {
  'pt-BR.json': {
    title: "Política de Privacidade e LGPD",
    lastUpdated: "Última atualização: Fevereiro de 2026",
    subtitle: "Seu restaurante seguro e em conformidade com as leis de proteção de dados.",
    intro: "A DopplerDine valoriza a privacidade dos seus dados e dos seus clientes. Explicamos aqui como coletamos, usamos e protegemos suas informações em conformidade com a Lei Geral de Proteção de Dados (LGPD).",
    dataCollectionTitle: "1. Coleta e Uso de Dados",
    dataCollectionText: "Coletamos informações necessárias para a prestação do serviço (nome, e-mail, telefone do lojista) e dados capturados via QR Code dos clientes do restaurante. Todos os dados coletados têm a finalidade exclusiva de alimentar suas campanhas e dashboard gerencial.",
    lgpdTitle: "2. Base Legal (LGPD)",
    lgpdText: "O tratamento de dados é realizado com base no consentimento fornecido pelo titular durante o cadastro e legitimo interesse para prestação dos nossos serviços de software SaaS.",
    securityTitle: "3. Segurança e Retenção",
    securityText: "Implementamos criptografia de ponta a ponta e rígidas políticas de acesso. Os dados são retidos apenas pelo tempo necessário para cumprir sua finalidade."
  },
  'en.json': {
    title: "Privacy Policy and GDPR",
    lastUpdated: "Last updated: February 2026",
    subtitle: "Your restaurant safe and compliant with data protection laws.",
    intro: "DopplerDine values the privacy of your data and your customers. We explain here how we collect, use, and protect your information in compliance with Data Protection Laws.",
    dataCollectionTitle: "1. Data Collection and Use",
    dataCollectionText: "We collect information necessary for the provision of the service (merchant's name, email, phone) and data captured via QR Code from restaurant customers. All data collected has the exclusive purpose of feeding your campaigns and management dashboard.",
    lgpdTitle: "2. Legal Basis",
    lgpdText: "Data processing is carried out based on the consent provided by the holder during registration and legitimate interest in providing our SaaS software services.",
    securityTitle: "3. Security and Retention",
    securityText: "We implement end-to-end encryption and strict access policies. Data is retained only for the time necessary to fulfill its purpose."
  },
  'es.json': {
    title: "Política de Privacidad y RGPD",
    lastUpdated: "Última actualización: Febrero de 2026",
    subtitle: "Su restaurante seguro y en conformidad con las leyes de protección de datos.",
    intro: "DopplerDine valora la privacidad de sus datos y los de sus clientes. Aquí explicamos cómo recopilamos, usamos y protegemos su información en cumplimiento de las Leyes de Protección de Datos.",
    dataCollectionTitle: "1. Recopilación y Uso de Datos",
    dataCollectionText: "Recopilamos información necesaria para la prestación del servicio (nombre del comerciante, correo electrónico, teléfono) y datos capturados a través del Código QR de los clientes del restaurante. Todos los datos recopilados tienen el propósito exclusivo de alimentar sus campañas y su panel de gestión.",
    lgpdTitle: "2. Base Legal",
    lgpdText: "El procesamiento de datos se lleva a cabo sobre la base del consentimiento otorgado por el titular durante el registro y el interés legítimo en la prestación de nuestros servicios de software SaaS.",
    securityTitle: "3. Seguridad y Retención",
    securityText: "Implementamos encriptación de extremo a extremo y estrictas políticas de acceso. Los datos se retienen solo por el tiempo necesario para cumplir su propósito."
  },
  'fr.json': {
    title: "Politique de Confidentialité et RGPD",
    lastUpdated: "Dernière mise à jour: Février 2026",
    subtitle: "Votre restaurant en sécurité et conforme aux lois sur la protection des données.",
    intro: "DopplerDine valorise la confidentialité de vos données et de celles de vos clients. Nous expliquons ici comment nous collectons, utilisons et protégeons vos informations conformément aux lois sur la protection des données.",
    dataCollectionTitle: "1. Collecte et Utilisation des Données",
    dataCollectionText: "Nous collectons les informations nécessaires à la fourniture du service (nom du commerçant, e-mail, téléphone) et les données capturées via QR Code des clients du restaurant. Toutes les données collectées ont pour seul but d'alimenter vos campagnes et votre tableau de bord de gestion.",
    lgpdTitle: "2. Base Législative",
    lgpdText: "Le traitement des données est effectué sur la base du consentement fourni par le titulaire lors de l'inscription et de l'intérêt légitime à fournir nos services logiciels SaaS.",
    securityTitle: "3. Sécurité et Rétention",
    securityText: "Nous mettons en œuvre un cryptage de bout en bout et des politiques d'accès strictes. Les données ne sont conservées que le temps nécessaire à l'accomplissement de leur finalité."
  }
};

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  if (fs.existsSync(filePath)) {
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!json.privacy) json.privacy = {};
    json.privacy = { ...json.privacy, ...privacyMissing[file] };
    
    // Add missing footer items based on language
    if (!json.footer) json.footer = {};
    if (file === 'pt-BR.json') {
      json.footer.terms = "Termos de Uso";
      json.footer.privacy = "Política de Privacidade";
    } else if (file === 'en.json') {
      json.footer.terms = "Terms of Service";
      json.footer.privacy = "Privacy Policy";
    } else if (file === 'es.json') {
      json.footer.terms = "Términos de Servicio";
      json.footer.privacy = "Política de Privacidad";
    } else if (file === 'fr.json') {
      json.footer.terms = "Conditions d'Utilisation";
      json.footer.privacy = "Politique de Confidentialité";
    }
    
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
    console.log(`Pushed Privacy Keys for ${file}`);
  }
});
