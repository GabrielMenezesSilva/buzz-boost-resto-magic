const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const pagesDir = path.join(__dirname, 'src', 'pages');

const dict = {
    // FAQ Items
    'support.faq.q1': { 'pt-BR': 'Como criar minha primeira campanha?', 'en': 'How to create my first campaign?', 'es': '¿Cómo crear mi primera campaña?', 'fr': 'Comment créer ma première campagne ?', 'it': 'Come creare la mia prima campagna?', 'de': 'Wie erstelle ich meine erste Kampagne?' },
    'support.faq.a1': { 'pt-BR': 'Para criar uma campanha, vá até \'Campanhas\' no menu principal, clique em \'Nova Campanha\' e siga o assistente passo a passo. Você poderá escolher o público-alvo, personalizar a mensagem e agendar o envio.', 'en': 'To create a campaign, go to \'Campaigns\' in the main menu, click \'New Campaign\' and follow the step-by-step assistant.', 'es': 'Para crear una campaña, ve a \'Campañas\' en el menú principal.', 'fr': 'Pour créer une campagne, allez dans \'Campagnes\'.', 'it': 'Per creare una campagna, vai in \'Campagne\'.', 'de': 'Um eine Kampagne zu erstellen, gehen Sie zu \'Kampagnen\'.' },

    'support.faq.q2': { 'pt-BR': 'Como funciona a coleta de contatos via QR Code?', 'en': 'How does contact collection via QR Code work?', 'es': '¿Cómo funciona la recolección vía Código QR?', 'fr': 'Comment fonctionne la collecte via QR Code ?', 'it': 'Come funziona la raccolta tramite QR Code?', 'de': 'Wie funktioniert die Kontaktakquise über QR-Code?' },
    'support.faq.a2': { 'pt-BR': 'Nosso sistema gera QR Codes únicos que, quando escaneados pelos clientes, direcionam para um formulário otimizado. Os dados são automaticamente sincronizados.', 'en': 'Our system generates unique QR Codes that direct customers to an optimized form. Data is automatically synced.', 'es': 'Nuestro sistema genera Códigos QR únicos.', 'fr': 'Notre système génère des QR Codes uniques.', 'it': 'Il nostro sistema genera QR Code unici.', 'de': 'Unser System generiert einzigartige QR-Codes.' },

    'support.faq.q3': { 'pt-BR': 'Posso personalizar as mensagens das campanhas?', 'en': 'Can I customize campaign messages?', 'es': '¿Puedo personalizar los mensajes?', 'fr': 'Puis-je personnaliser les messages ?', 'it': 'Posso personalizzare i messaggi?', 'de': 'Kann ich Kampagnennachrichten anpassen?' },
    'support.faq.a3': { 'pt-BR': 'Sim! Oferecemos templates personalizáveis e a opção de criar mensagens do zero. Você pode incluir o nome do cliente e muito mais.', 'en': 'Yes! We offer customizable templates and the option to create messages from scratch.', 'es': '¡Sí! Ofrecemos plantillas personalizables.', 'fr': 'Oui ! Nous proposons des modèles.', 'it': 'Sì! Offriamo modelli personalizzabili.', 'de': 'Ja! Wir bieten anpassbare Vorlagen.' },

    'support.faq.q4': { 'pt-BR': 'Como funciona o programa de indicações?', 'en': 'How does the referral program work?', 'es': '¿Cómo funciona el programa de referidos?', 'fr': 'Comment fonctionne le programme de parrainage ?', 'it': 'Come funziona il programma di riferimento?', 'de': 'Wie funktioniert das Empfehlungsprogramm?' },
    'support.faq.a4': { 'pt-BR': 'A cada cliente que você indica e que se torna um usuário ativo, você ganha créditos que podem ser usados para envios extras ou upgrades no seu plano.', 'en': 'For each client you refer who becomes an active user, you earn credits.', 'es': 'Gana créditos por cada cliente referido.', 'fr': 'Gagnez des crédits pour chaque client.', 'it': 'Guadagna crediti per ogni cliente.', 'de': 'Verdienen Sie Credits für jeden Kunden.' },

    'support.faq.q5': { 'pt-BR': 'Meus dados estão seguros?', 'en': 'Are my data secure?', 'es': '¿Están seguros mis datos?', 'fr': 'Mes données sont-elles en sécurité ?', 'it': 'I miei dati sono al sicuro?', 'de': 'Sind meine Daten sicher?' },
    'support.faq.a5': { 'pt-BR': 'Absolutamente. Utilizamos criptografia de ponta a ponta, backup automático e seguimos todas as normas da LGPD.', 'en': 'Absolutely. We use end-to-end encryption.', 'es': 'Absolutamente. Usamos encriptación.', 'fr': 'Absolument. Nous utilisons le cryptage.', 'it': 'Assolutamente. Utilizziamo la crittografia.', 'de': 'Absolut. Wir verwenden Verschlüsselung.' },

    // Quick Links
    'support.links.t1': { 'pt-BR': 'Guia de Início Rápido', 'en': 'Quick Start Guide', 'es': 'Guía de Inicio Rápido', 'fr': 'Guide de Démarrage', 'it': 'Guida Rapida', 'de': 'Schnellstartanleitung' },
    'support.links.d1': { 'pt-BR': 'Primeiros passos no DopplerDine', 'en': 'First steps in DopplerDine', 'es': 'Primeros pasos', 'fr': 'Premiers pas', 'it': 'Primi passi', 'de': 'Erste Schritte' },

    'support.links.t2': { 'pt-BR': 'Documentação Completa', 'en': 'Full Documentation', 'es': 'Documentación Completa', 'fr': 'Documentation complète', 'it': 'Documentazione Completa', 'de': 'Vollständige Dokumentation' },
    'support.links.d2': { 'pt-BR': 'Guias detalhados e tutoriais', 'en': 'Detailed guides and tutorials', 'es': 'Guías detalladas', 'fr': 'Guides détaillés', 'it': 'Guide dettagliate', 'de': 'Detaillierte Anleitungen' },

    'support.links.t3': { 'pt-BR': 'Vídeos Tutoriais', 'en': 'Video Tutorials', 'es': 'Videotutoriales', 'fr': 'Tutoriels Vidéo', 'it': 'Video Tutorial', 'de': 'Video-Tutorials' },
    'support.links.d3': { 'pt-BR': 'Aprenda assistindo', 'en': 'Learn by watching', 'es': 'Aprende viendo', 'fr': 'Apprendre en regardant', 'it': 'Impara guardando', 'de': 'Lernen durch Zusehen' },

    'support.links.t4': { 'pt-BR': 'Segurança e Privacidade', 'en': 'Security and Privacy', 'es': 'Seguridad y Privacidad', 'fr': 'Sécurité et Confidentialité', 'it': 'Sicurezza e Privacy', 'de': 'Sicherheit und Datenschutz' },
    'support.links.d4': { 'pt-BR': 'Como protegemos seus dados', 'en': 'How we protect your data', 'es': 'Cómo protegemos sus datos', 'fr': 'Comment nous protégeons vos données', 'it': 'Come proteggiamo i tuoi dati', 'de': 'Wie wir Ihre Daten schützen' },
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

console.log('Dictionaries populated with FAQ and Quick Links!');
