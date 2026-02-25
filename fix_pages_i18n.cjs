const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const pagesDir = path.join(__dirname, 'src', 'pages');

const dict = {
    // Plans.tsx
    'plans.choosePlanTitle': { 'pt-BR': 'Escolha seu Plano de Crescimento', 'en': 'Choose your Growth Plan', 'es': 'Elige tu Plan de Crecimiento', 'fr': 'Choisissez votre Plan de Croissance', 'it': 'Scegli il tuo Piano di Crescita', 'de': 'Wählen Sie Ihren Wachstumsplan' },
    'plans.choosePlanDesc': { 'pt-BR': 'Do teste gratuito ao crescimento explosivo. Cada plano é desenhado para maximizar seus resultados.', 'en': 'From free trial to explosive growth. Each plan is designed to maximize your results.', 'es': 'Desde la prueba gratuita hasta el crecimiento explosivo.', 'fr': 'De l\'essai gratuit à la croissance explosive.', 'it': 'Dalla prova gratuita alla crescita esplosiva.', 'de': 'Von der kostenlosen Testversion bis zum explosiven Wachstum.' },

    // Settings.tsx
    'settings.savedTitle': { 'pt-BR': 'Configurações salvas', 'en': 'Settings saved', 'es': 'Configuración guardada', 'fr': 'Paramètres enregistrés', 'it': 'Impostazioni salvate', 'de': 'Einstellungen gespeichert' },
    'settings.savedDesc': { 'pt-BR': 'Suas preferências foram atualizadas com sucesso.', 'en': 'Your preferences have been successfully updated.', 'es': 'Tus preferencias han sido actualizadas con éxito.', 'fr': 'Vos préférences ont été mises à jour avec succès.', 'it': 'Le tue preferenze sono state aggiornate con successo.', 'de': 'Ihre Einstellungen wurden erfolgreich aktualisiert.' },
    'settings.notifications': { 'pt-BR': 'Notificações', 'en': 'Notifications', 'es': 'Notificaciones', 'fr': 'Notifications', 'it': 'Notifiche', 'de': 'Benachrichtigungen' },
    'settings.notificationsDesc': { 'pt-BR': 'Controle como e quando você recebe notificações', 'en': 'Control how and when you receive notifications', 'es': 'Controla cómo y cuándo recibes notificaciones', 'fr': 'Contrôlez comment et quand vous recevez des notifications', 'it': 'Controlla come e quando ricevi le notifiche', 'de': 'Steuern Sie, wie und wann Sie Benachrichtigungen erhalten' },
    'settings.emailNotifs': { 'pt-BR': 'Notificações por Email', 'en': 'Email Notifications', 'es': 'Notificaciones por Email', 'fr': 'Notifications par Email', 'it': 'Notifiche via Email', 'de': 'E-Mail-Benachrichtigungen' },
    'settings.emailNotifsDesc': { 'pt-BR': 'Receba updates sobre campanhas e novos contatos', 'en': 'Receive updates on campaigns and new contacts', 'es': 'Recibe actualizaciones de campañas y nuevos contactos', 'fr': 'Recevez des mises à jour sur les campagnes et les nouveaux contacts', 'it': 'Ricevi aggiornamenti sulle campagne e i nuovi contatti', 'de': 'Erhalten Sie Updates zu Kampagnen und neuen Kontakten' },
    'settings.pushNotifs': { 'pt-BR': 'Notificações Push', 'en': 'Push Notifications', 'es': 'Notificaciones Push', 'fr': 'Notifications Push', 'it': 'Notifiche Push', 'de': 'Push-Benachrichtigungen' },
    'settings.pushNotifsDesc': { 'pt-BR': 'Alertas instantâneos no navegador', 'en': 'Instant alerts in the browser', 'es': 'Alertas instantáneas en el navegador', 'fr': 'Alertes instantanées dans le navigateur', 'it': 'Avvisi istantanei nel browser', 'de': 'Sofortige Warnungen im Browser' },
    'settings.smsNotifsDesc': { 'pt-BR': 'Notificações importantes via SMS', 'en': 'Important notifications via SMS', 'es': 'Notificaciones importantes por SMS', 'fr': 'Notifications importantes par SMS', 'it': 'Notifiche importanti via SMS', 'de': 'Wichtige Benachrichtigungen per SMS' },
    'settings.marketingNotifs': { 'pt-BR': 'Marketing', 'en': 'Marketing', 'es': 'Marketing', 'fr': 'Marketing', 'it': 'Marketing', 'de': 'Marketing' },
    'settings.marketingNotifsDesc': { 'pt-BR': 'Novidades e promoções do DopplerDine', 'en': 'News and promotions from DopplerDine', 'es': 'Noticias y promociones de DopplerDine', 'fr': 'Nouvelles et promotions de DopplerDine', 'it': 'Novità e promozioni di DopplerDine', 'de': 'Neuigkeiten und Aktionen von DopplerDine' },
    'settings.appearance': { 'pt-BR': 'Aparência', 'en': 'Appearance', 'es': 'Apariencia', 'fr': 'Apparence', 'it': 'Aspetto', 'de': 'Erscheinungsbild' },
    'settings.appearanceDesc': { 'pt-BR': 'Personalize a interface de acordo com suas preferências', 'en': 'Personalize the interface according to your preferences', 'es': 'Personaliza la interfaz según tus preferencias', 'fr': 'Personnalisez l\'interface selon vos préférences', 'it': 'Personalizza l\'interfaccia in base alle tue preferenze', 'de': 'Personalisieren Sie die Schnittstelle nach Ihren Wünschen' },
    'settings.themeLight': { 'pt-BR': 'Claro', 'en': 'Light', 'es': 'Claro', 'fr': 'Clair', 'it': 'Chiaro', 'de': 'Hell' },
    'settings.themeDark': { 'pt-BR': 'Escuro', 'en': 'Dark', 'es': 'Oscuro', 'fr': 'Sombre', 'it': 'Scuro', 'de': 'Dunkel' },
    'settings.themeSystem': { 'pt-BR': 'Sistema', 'en': 'System', 'es': 'Sistema', 'fr': 'Système', 'it': 'Sistema', 'de': 'System' },
    'settings.soundEffects': { 'pt-BR': 'Efeitos Sonoros', 'en': 'Sound Effects', 'es': 'Efectos de Sonido', 'fr': 'Effets Sonores', 'it': 'Effetti Sonori', 'de': 'Soundeffekte' },
    'settings.privacySecurity': { 'pt-BR': 'Privacidade e Segurança', 'en': 'Privacy and Security', 'es': 'Privacidad y Seguridad', 'fr': 'Confidentialité et sécurité', 'it': 'Privacy e Sicurezza', 'de': 'Datenschutz und Sicherheit' },
    'settings.privacyDesc': { 'pt-BR': 'Gerencie como seus dados são coletados e utilizados', 'en': 'Manage how your data is collected and used', 'es': 'Gestiona cómo se recopilan y utilizan tus datos', 'fr': 'Gérez la façon dont vos données sont collectées et utilisées', 'it': 'Gestisci come vengono raccolti e utilizzati i tuoi dati', 'de': 'Verwalten Sie, wie Ihre Daten erfasst und verwendet werden' },
    'settings.usageAnalytics': { 'pt-BR': 'Análise de Uso', 'en': 'Usage Analytics', 'es': 'Análisis de Uso', 'fr': 'Analyse d\'utilisation', 'it': 'Analisi di utilizzo', 'de': 'Nutzungsanalyse' },
    'settings.usageDesc': { 'pt-BR': 'Nos ajude a melhorar o produto com dados anônimos de uso', 'en': 'Help us improve the product with anonymous usage data', 'es': 'Ayúdanos a mejorar el producto con datos anónimos', 'fr': 'Aidez-nous à améliorer le produit avec des données d\'utilisation anonymes', 'it': 'Aiutaci a migliorare il prodotto con dati di utilizzo anonimi', 'de': 'Helfen Sie uns, das Produkt mit anonymen Nutzungsdaten zu verbessern' },
    'settings.functionalCookies': { 'pt-BR': 'Cookies Funcionais', 'en': 'Functional Cookies', 'es': 'Cookies Funcionales', 'fr': 'Cookies Fonctionnels', 'it': 'Cookie Funzionali', 'de': 'Funktionale Cookies' },
    'settings.cookiesDesc': { 'pt-BR': 'Necessários para manter suas preferências e sessão', 'en': 'Required to maintain your preferences and session', 'es': 'Necesario para mantener sus preferencias', 'fr': 'Requis pour conserver vos préférences', 'it': 'Richiesto per mantenere le tue preferenze', 'de': 'Erforderlich, um Ihre Einstellungen zu speichern' },
    'settings.dataSharing': { 'pt-BR': 'Compartilhamento de Dados', 'en': 'Data Sharing', 'es': 'Intercambio de Datos', 'fr': 'Partage de données', 'it': 'Condivisione di Dati', 'de': 'Datenaustausch' },
    'settings.dataSharingDesc': { 'pt-BR': 'Permitir compartilhamento com parceiros para melhorar serviços', 'en': 'Allow sharing with partners to improve services', 'es': 'Permitir compartir con socios para mejorar los servicios', 'fr': 'Autoriser le partage avec des partenaires', 'it': 'Consenti la condivisione con i partner', 'de': 'Teilen mit Partnern zur Verbesserung der Dienste' },
    'settings.dataBackup': { 'pt-BR': 'Dados e Backup', 'en': 'Data and Backup', 'es': 'Datos y Respaldo', 'fr': 'Données et Sauvegarde', 'it': 'Dati e Backup', 'de': 'Daten und Backup' },
    'settings.dataBackupDesc': { 'pt-BR': 'Gerencie seus dados e faça backup das informações', 'en': 'Manage your data and backup information', 'es': 'Gestiona tus datos y realiza respaldos', 'fr': 'Gérez vos données et sauvegardez les informations', 'it': 'Gestisci i tuoi dati ed esegui il backup', 'de': 'Verwalten Sie Ihre Daten und sichern Sie Informationen' },
    'settings.exportData': { 'pt-BR': 'Exportar Dados', 'en': 'Export Data', 'es': 'Exportar Datos', 'fr': 'Exporter des données', 'it': 'Esporta Dati', 'de': 'Daten Exportieren' },
    'settings.autoBackup': { 'pt-BR': 'Backup Automático', 'en': 'Automatic Backup', 'es': 'Respaldo Automático', 'fr': 'Sauvegarde Automatique', 'it': 'Backup Automatico', 'de': 'Automatisches Backup' },
    'settings.backupInfo': { 'pt-BR': 'Seus dados são automaticamente salvos em backup a cada 24 horas. Último backup: há 2 horas', 'en': 'Your data is automatically backed up every 24 hours. Last backup: 2 hours ago', 'es': 'Tus datos se respaldan automáticamente.', 'fr': 'Vos données sont automatiquement sauvegardées.', 'it': 'Il backup dei dati avviene automaticamente.', 'de': 'Ihre Daten werden automatisch gesichert.' },
    'settings.save': { 'pt-BR': 'Salvar Configurações', 'en': 'Save Settings', 'es': 'Guardar Configuración', 'fr': 'Enregistrer les Paramètres', 'it': 'Salva Impostazioni', 'de': 'Einstellungen Speichern' },

    // Support.tsx
    'support.msgSent': { 'pt-BR': 'Mensagem enviada', 'en': 'Message sent', 'es': 'Mensaje enviado', 'fr': 'Message envoyé', 'it': 'Messaggio inviato', 'de': 'Nachricht gesendet' },
    'support.msgDesc': { 'pt-BR': 'Nossa equipe responderá em até 24 horas.', 'en': 'Our team will respond within 24 hours.', 'es': 'Nuestro equipo responderá en 24 horas.', 'fr': 'Notre équipe répondra sous 24h.', 'it': 'Il nostro team risponderà entro 24 ore.', 'de': 'Unser Team antwortet innerhalb von 24 Stunden.' },
    'support.title': { 'pt-BR': 'Central de Ajuda', 'en': 'Help Center', 'es': 'Centro de Ayuda', 'fr': 'Centre d\'aide', 'it': 'Centro Assistenza', 'de': 'Hilfe-Center' },
    'support.subtitle': { 'pt-BR': 'Estamos aqui para ajudar você a aproveitar ao máximo o DopplerDine', 'en': 'Here to help you get the most out of DopplerDine', 'es': 'Aquí para ayudarte', 'fr': 'Ici pour vous aider', 'it': 'Siamo qui per aiutarti', 'de': 'Hier, um zu helfen' },
    'support.allSystemsOperational': { 'pt-BR': 'Todos os sistemas operacionais', 'en': 'All systems operational', 'es': 'Todos los sistemas operativos', 'fr': 'Tous les systèmes sont opérationnels', 'it': 'Tutti i sistemi operativi', 'de': 'Alle Systeme betriebsbereit' },
    'support.uptime': { 'pt-BR': '99.9% Uptime', 'en': '99.9% Uptime', 'es': '99.9% Uptime', 'fr': '99.9% Uptime', 'it': '99.9% Uptime', 'de': '99.9% Uptime' },
    'support.lastUpdate': { 'pt-BR': 'Última atualização: há 2 min', 'en': 'Last update: 2 min ago', 'es': 'Última actualización: hace 2 min', 'fr': 'Dernière mise à jour : il y a 2 min', 'it': 'Ultimo aggiornamento: 2 min fa', 'de': 'Letztes Update: vor 2 Min' },
    'support.faqTitle': { 'pt-BR': 'Perguntas Frequentes', 'en': 'Frequently Asked Questions', 'es': 'Preguntas Frecuentes', 'fr': 'Foire Aux Questions', 'it': 'Domande Frequenti', 'de': 'Häufig Gestellte Fragen' },
    'support.faqDesc': { 'pt-BR': 'Encontre respostas rápidas para as dúvidas mais comuns', 'en': 'Find quick answers to common questions', 'es': 'Encuentra respuestas rápidas', 'fr': 'Trouvez des réponses rapides', 'it': 'Trova risposte rapide', 'de': 'Finden Sie schnelle Antworten' },
    'support.searchPlaceholder': { 'pt-BR': 'Busque por palavra-chave...', 'en': 'Search by keyword...', 'es': 'Buscar por palabra clave...', 'fr': 'Rechercher par mot-clé...', 'it': 'Cerca per parola chiave...', 'de': 'Nach Stichwort suchen...' },
    'support.results': { 'pt-BR': 'resultado(s)', 'en': 'result(s)', 'es': 'resultado(s)', 'fr': 'résultat(s)', 'it': 'risultato/i', 'de': 'Ergebnis(se)' },
    'support.noResults': { 'pt-BR': 'Nenhum resultado encontrado para', 'en': 'No results found for', 'es': 'No se encontraron resultados para', 'fr': 'Aucun résultat pour', 'it': 'Nessun risultato per', 'de': 'Keine Ergebnisse für' },
    'support.tryOtherTerms': { 'pt-BR': 'Tente outros termos ou entre em contato conosco', 'en': 'Try other terms or contact us', 'es': 'Prueba otros términos', 'fr': 'Essayez d\'autres termes', 'it': 'Prova altri termini', 'de': 'Probieren Sie andere Begriffe' },
    'support.contactTitle': { 'pt-BR': 'Entre em Contato', 'en': 'Contact Us', 'es': 'Contáctenos', 'fr': 'Nous Contacter', 'it': 'Contattaci', 'de': 'Kontaktieren Sie uns' },
    'support.contactDesc': { 'pt-BR': 'Não encontrou o que procura? Nossa equipe está pronta para ajudar', 'en': 'Didn\'t find what you need? We are ready to help', 'es': '¿No encontraste lo que buscas?', 'fr': 'Vous n\'avez pas trouvé ?', 'it': 'Non hai trovato quello che cerchi?', 'de': 'Nicht gefunden, was Sie suchen?' },
    'support.subject': { 'pt-BR': 'Assunto', 'en': 'Subject', 'es': 'Asunto', 'fr': 'Sujet', 'it': 'Oggetto', 'de': 'Betreff' },
    'support.subjectPlaceholder': { 'pt-BR': 'Resumo da sua dúvida', 'en': 'Summary of your question', 'es': 'Resumen de tu pregunta', 'fr': 'Résumé de votre question', 'it': 'Riepilogo della domanda', 'de': 'Zusammenfassung Ihrer Frage' },
    'support.priority': { 'pt-BR': 'Prioridade', 'en': 'Priority', 'es': 'Prioridad', 'fr': 'Priorité', 'it': 'Priorità', 'de': 'Priorität' },
    'support.low': { 'pt-BR': 'Baixa', 'en': 'Low', 'es': 'Baja', 'fr': 'Basse', 'it': 'Bassa', 'de': 'Niedrig' },
    'support.medium': { 'pt-BR': 'Média', 'en': 'Medium', 'es': 'Media', 'fr': 'Moyenne', 'it': 'Media', 'de': 'Mittel' },
    'support.high': { 'pt-BR': 'Alta', 'en': 'High', 'es': 'Alta', 'fr': 'Haute', 'it': 'Alta', 'de': 'Hoch' },
    'support.message': { 'pt-BR': 'Mensagem', 'en': 'Message', 'es': 'Mensaje', 'fr': 'Message', 'it': 'Messaggio', 'de': 'Nachricht' },
    'support.messagePlaceholder': { 'pt-BR': 'Descreva sua dúvida ou problema em detalhes...', 'en': 'Describe your issue in detail...', 'es': 'Describe tu problema en detalle...', 'fr': 'Décrivez votre problème en détail...', 'it': 'Descrivi il tuo problema in dettaglio...', 'de': 'Beschreiben Sie Ihr Problem im Detail...' },
    'support.send': { 'pt-BR': 'Enviar Mensagem', 'en': 'Send Message', 'es': 'Enviar Mensaje', 'fr': 'Envoyer le message', 'it': 'Invia Messaggio', 'de': 'Nachricht Senden' },
    'support.usefulLinks': { 'pt-BR': 'Links Úteis', 'en': 'Useful Links', 'es': 'Enlaces Útiles', 'fr': 'Liens Utiles', 'it': 'Link Utili', 'de': 'Nützliche Links' },
    'support.directContact': { 'pt-BR': 'Contato Direto', 'en': 'Direct Contact', 'es': 'Contacto Directo', 'fr': 'Contact Direct', 'it': 'Contatto Diretto', 'de': 'Direkter Kontakt' },
    'support.urgentSupport': { 'pt-BR': 'Para suporte urgente', 'en': 'For urgent support', 'es': 'Para soporte urgente', 'fr': 'Pour une assistance urgente', 'it': 'Per supporto urgente', 'de': 'Für dringenden Support' },
    'support.phone': { 'pt-BR': 'Telefone', 'en': 'Phone', 'es': 'Teléfono', 'fr': 'Téléphone', 'it': 'Telefono', 'de': 'Telefon' },
    'support.email': { 'pt-BR': 'Email', 'en': 'Email', 'es': 'Email', 'fr': 'Email', 'it': 'Email', 'de': 'Email' },
    'support.businessHours': { 'pt-BR': 'Horário de Atendimento', 'en': 'Business Hours', 'es': 'Horario de Atención', 'fr': 'Heures d\'ouverture', 'it': 'Orari di Apertura', 'de': 'Geschäftszeiten' },
    'support.hours': { 'pt-BR': 'Seg-Sex: 8h às 18h', 'en': 'Mon-Fri: 8am to 6pm', 'es': 'Lun-Vie: 8am a 6pm', 'fr': 'Lun-Ven: 8h à 18h', 'it': 'Lun-Ven: 8:00 - 18:00', 'de': 'Mo-Fr: 8 bis 18 Uhr' },
    'support.accountStatus': { 'pt-BR': 'Status da Conta', 'en': 'Account Status', 'es': 'Estado de la Cuenta', 'fr': 'Statut du compte', 'it': 'Stato dell\'account', 'de': 'Kontostatus' },
    'support.priorityBadge': { 'pt-BR': 'Prioritário', 'en': 'Priority', 'es': 'Prioritario', 'fr': 'Prioritaire', 'it': 'Prioritario', 'de': 'Höchste Priorität' },
    'support.avgTime': { 'pt-BR': 'Tempo Médio', 'en': 'Average Time', 'es': 'Tiempo Promedio', 'fr': 'Temps Moyen', 'it': 'Tempo Medio', 'de': 'Durchschnittszeit' },
    'support.timeFrame': { 'pt-BR': '2-4 horas', 'en': '2-4 hours', 'es': '2-4 horas', 'fr': '2-4 heures', 'it': '2-4 ore', 'de': '2-4 Stunden' },
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

// Replace text in files
const plansReplacements = [
    { s: "Escolha seu Plano de Crescimento", r: "{t('plans.choosePlanTitle')}" },
    { s: "Do teste gratuito ao crescimento explosivo. Cada plano é desenhado para maximizar seus resultados.", r: "{t('plans.choosePlanDesc')}" }
];

const settingsReplacements = [
    { s: '"Configurações salvas"', r: "t('settings.savedTitle')" },
    { s: '"Suas preferências foram atualizadas com sucesso."', r: "t('settings.savedDesc')" },
    { s: ">\n            Configurações\n          </h1>", r: ">\n            {t('nav.settings')}\n          </h1>" },
    { s: ">\n                Notificações\n              </CardTitle>", r: ">\n                {t('settings.notifications')}\n              </CardTitle>" },
    { s: ">\n                Controle como e quando você recebe notificações\n              </CardDescription>", r: ">\n                {t('settings.notificationsDesc')}\n              </CardDescription>" },
    { s: ">\n                        Notificações por Email\n                      </Label>", r: ">\n                        {t('settings.emailNotifs')}\n                      </Label>" },
    { s: ">\n                    Receba updates sobre campanhas e novos contatos\n                  </p>", r: ">\n                    {t('settings.emailNotifsDesc')}\n                  </p>" },
    { s: ">\n                        Notificações Push\n                      </Label>", r: ">\n                        {t('settings.pushNotifs')}\n                      </Label>" },
    { s: ">\n                    Alertas instantâneos no navegador\n                  </p>", r: ">\n                    {t('settings.pushNotifsDesc')}\n                  </p>" },
    { s: ">\n                    Notificações importantes via SMS\n                  </p>", r: ">\n                    {t('settings.smsNotifsDesc')}\n                  </p>" },
    { s: ">SMS</Label>", r: ">{t('campaigns.sms')}</Label>" },
    { s: ">\n                        Marketing\n                      </Label>", r: ">\n                        {t('settings.marketingNotifs')}\n                      </Label>" },
    { s: ">\n                    Novidades e promoções do DopplerDine\n                  </p>", r: ">\n                    {t('settings.marketingNotifsDesc')}\n                  </p>" },
    { s: ">\n                Aparência\n              </CardTitle>", r: ">\n                {t('settings.appearance')}\n              </CardTitle>" },
    { s: ">\n                Personalize a interface de acordo com suas preferências\n              </CardDescription>", r: ">\n                {t('settings.appearanceDesc')}\n              </CardDescription>" },
    { s: ">Claro</SelectItem>", r: ">{t('settings.themeLight')}</SelectItem>" },
    { s: ">Escuro</SelectItem>", r: ">{t('settings.themeDark')}</SelectItem>" },
    { s: ">Sistema</SelectItem>", r: ">{t('settings.themeSystem')}</SelectItem>" },
    { s: ">\n                    Efeitos Sonoros\n                  </Label>", r: ">\n                    {t('settings.soundEffects')}\n                  </Label>" },
    { s: ">\n                Privacidade e Segurança\n              </CardTitle>", r: ">\n                {t('settings.privacySecurity')}\n              </CardTitle>" },
    { s: ">\n                Gerencie como seus dados são coletados e utilizados\n              </CardDescription>", r: ">\n                {t('settings.privacyDesc')}\n              </CardDescription>" },
    { s: ">\n                      Análise de Uso\n                    </Label>", r: ">\n                      {t('settings.usageAnalytics')}\n                    </Label>" },
    { s: ">\n                      Nos ajude a melhorar o produto com dados anônimos de uso\n                    </p>", r: ">\n                      {t('settings.usageDesc')}\n                    </p>" },
    { s: ">\n                      Cookies Funcionais\n                    </Label>", r: ">\n                      {t('settings.functionalCookies')}\n                    </Label>" },
    { s: ">\n                      Necessários para manter suas preferências e sessão\n                    </p>", r: ">\n                      {t('settings.cookiesDesc')}\n                    </p>" },
    { s: ">\n                      Compartilhamento de Dados\n                    </Label>", r: ">\n                      {t('settings.dataSharing')}\n                    </Label>" },
    { s: ">\n                      Permitir compartilhamento com parceiros para melhorar serviços\n                    </p>", r: ">\n                      {t('settings.dataSharingDesc')}\n                    </p>" },
    { s: ">\n                Dados e Backup\n              </CardTitle>", r: ">\n                {t('settings.dataBackup')}\n              </CardTitle>" },
    { s: ">\n                Gerencie seus dados e faça backup das informações\n              </CardDescription>", r: ">\n                {t('settings.dataBackupDesc')}\n              </CardDescription>" },
    { s: "Exportar Dados", r: "{t('settings.exportData')}" },
    { s: "Backup Automático", r: "{t('settings.autoBackup')}" },
    { s: "Seus dados são automaticamente salvos em backup a cada 24 horas.\n                Último backup: há 2 horas", r: "{t('settings.backupInfo')}" },
    { s: "Salvar Configurações", r: "{t('settings.save')}" }
];

const supportReplacements = [
    { s: '"Mensagem enviada"', r: "t('support.msgSent')" },
    { s: '"Nossa equipe responderá em até 24 horas."', r: "t('support.msgDesc')" },
    { s: ">\n            Central de Ajuda\n          </h1>", r: ">\n            {t('support.title')}\n          </h1>" },
    { s: ">\n            Estamos aqui para ajudar você a aproveitar ao máximo o DopplerDine\n          </p>", r: ">\n            {t('support.subtitle')}\n          </p>" },
    { s: ">Todos os sistemas operacionais</span>", r: ">{t('support.allSystemsOperational')}</span>" },
    { s: ">\n                99.9% Uptime\n              </Badge>", r: ">\n                {t('support.uptime')}\n              </Badge>" },
    { s: "Última atualização: há 2 min", r: "{t('support.lastUpdate')}" },
    { s: ">\n                  Perguntas Frequentes\n                </CardTitle>", r: ">\n                  {t('support.faqTitle')}\n                </CardTitle>" },
    { s: ">\n                  Encontre respostas rápidas para as dúvidas mais comuns\n                </CardDescription>", r: ">\n                  {t('support.faqDesc')}\n                </CardDescription>" },
    { s: 'placeholder="Busque por palavra-chave..."', r: 'placeholder={t("support.searchPlaceholder")}' },
    { s: "resultado(s)", r: "{t('support.results')}" },
    { s: 'Nenhum resultado encontrado para', r: '{t("support.noResults")}' },
    { s: "Tente outros termos ou entre em contato conosco", r: "{t('support.tryOtherTerms')}" },
    { s: ">\n                  Entre em Contato\n                </CardTitle>", r: ">\n                  {t('support.contactTitle')}\n                </CardTitle>" },
    { s: ">\n                  Não encontrou o que procura? Nossa equipe está pronta para ajudar\n                </CardDescription>", r: ">\n                  {t('support.contactDesc')}\n                </CardDescription>" },
    { s: ">Assunto</Label>", r: ">{t('support.subject')}</Label>" },
    { s: 'placeholder="Resumo da sua dúvida"', r: 'placeholder={t("support.subjectPlaceholder")}' },
    { s: ">Prioridade</Label>", r: ">{t('support.priority')}</Label>" },
    { s: ">🟢 Baixa</option>", r: ">🟢 {t('support.low')}</option>" },
    { s: ">🟡 Média</option>", r: ">🟡 {t('support.medium')}</option>" },
    { s: ">🔴 Alta</option>", r: ">🔴 {t('support.high')}</option>" },
    { s: ">Mensagem</Label>", r: ">{t('support.message')}</Label>" },
    { s: 'placeholder="Descreva sua dúvida ou problema em detalhes..."', r: 'placeholder={t("support.messagePlaceholder")}' },
    { s: "Enviar Mensagem", r: "{t('support.send')}" },
    { s: ">Links Úteis</CardTitle>", r: ">{t('support.usefulLinks')}</CardTitle>" },
    { s: ">Contato Direto</CardTitle>", r: ">{t('support.directContact')}</CardTitle>" },
    { s: ">Para suporte urgente</CardDescription>", r: ">{t('support.urgentSupport')}</CardDescription>" },
    { s: ">Telefone</p>", r: ">{t('support.phone')}</p>" },
    { s: ">Email</p>", r: ">{t('support.email')}</p>" },
    { s: ">Horário de Atendimento</p>", r: ">{t('support.businessHours')}</p>" },
    { s: ">Seg-Sex: 8h às 18h</p>", r: ">{t('support.hours')}</p>" },
    { s: ">Status da Conta</CardTitle>", r: ">{t('support.accountStatus')}</CardTitle>" },
    { s: ">Plano Atual</span>", r: ">{t('nav.currentPlan')}</span>" },
    { s: ">Suporte</span>", r: ">{t('nav.helpSupport')}</span>" },
    { s: "Prioritário", r: "{t('support.priorityBadge')}" },
    { s: ">Tempo Médio</span>", r: ">{t('support.avgTime')}</span>" },
    { s: ">2-4 horas</span>", r: ">{t('support.timeFrame')}</span>" }
];

const applyReplacements = (filePath, rules) => {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        rules.forEach(rule => {
            content = content.replace(rule.s, rule.r);
        });
        fs.writeFileSync(filePath, content, 'utf8');
    }
};

applyReplacements(path.join(pagesDir, 'Plans.tsx'), plansReplacements);
applyReplacements(path.join(pagesDir, 'Settings.tsx'), settingsReplacements);
applyReplacements(path.join(pagesDir, 'Support.tsx'), supportReplacements);

console.log('Static texts replaced and dictionaries populated successfully!');
