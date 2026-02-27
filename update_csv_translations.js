import fs from 'fs';
import path from 'path';

const localesDir = path.join(process.cwd(), 'src', 'locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

const tr = {
    "pt-BR": {
        "contacts.exportHeaders.name": "Nome",
        "contacts.exportHeaders.phone": "Telefone",
        "contacts.exportHeaders.email": "Email",
        "contacts.exportHeaders.source": "Origem",
        "contacts.exportHeaders.date": "Data",
        "contacts.exportSuccess": "Exportação Concluída",
        "contacts.exportSuccessDesc": "Seu arquivo CSV foi baixado com sucesso.",
        "contacts.exportError": "Erro na Exportação",
        "contacts.exportErrorDesc": "Ocorreu um erro ao gerar o arquivo CSV."
    },
    "en": {
        "contacts.exportHeaders.name": "Name",
        "contacts.exportHeaders.phone": "Phone",
        "contacts.exportHeaders.email": "Email",
        "contacts.exportHeaders.source": "Source",
        "contacts.exportHeaders.date": "Date",
        "contacts.exportSuccess": "Export Complete",
        "contacts.exportSuccessDesc": "Your CSV file was downloaded successfully.",
        "contacts.exportError": "Export Error",
        "contacts.exportErrorDesc": "An error occurred while generating the CSV file."
    },
    "es": {
        "contacts.exportHeaders.name": "Nombre",
        "contacts.exportHeaders.phone": "Teléfono",
        "contacts.exportHeaders.email": "Correo",
        "contacts.exportHeaders.source": "Origen",
        "contacts.exportHeaders.date": "Fecha",
        "contacts.exportSuccess": "Exportación Completada",
        "contacts.exportSuccessDesc": "Su archivo CSV se descargó correctamente.",
        "contacts.exportError": "Error de Exportación",
        "contacts.exportErrorDesc": "Ocurrió un error al generar el archivo CSV."
    },
    "fr": {
        "contacts.exportHeaders.name": "Nom",
        "contacts.exportHeaders.phone": "Téléphone",
        "contacts.exportHeaders.email": "Email",
        "contacts.exportHeaders.source": "Source",
        "contacts.exportHeaders.date": "Date",
        "contacts.exportSuccess": "Exportation Terminée",
        "contacts.exportSuccessDesc": "Votre fichier CSV a été téléchargé avec succès.",
        "contacts.exportError": "Erreur d'Exportation",
        "contacts.exportErrorDesc": "Une erreur s'est produite lors de la génération du fichier CSV."
    },
    "de": {
        "contacts.exportHeaders.name": "Name",
        "contacts.exportHeaders.phone": "Telefon",
        "contacts.exportHeaders.email": "E-Mail",
        "contacts.exportHeaders.source": "Quelle",
        "contacts.exportHeaders.date": "Datum",
        "contacts.exportSuccess": "Export Abgeschlossen",
        "contacts.exportSuccessDesc": "Ihre CSV-Datei wurde erfolgreich heruntergeladen.",
        "contacts.exportError": "Exportfehler",
        "contacts.exportErrorDesc": "Beim Erstellen der CSV-Datei ist ein Fehler aufgetreten."
    },
    "it": {
        "contacts.exportHeaders.name": "Nome",
        "contacts.exportHeaders.phone": "Telefono",
        "contacts.exportHeaders.email": "Email",
        "contacts.exportHeaders.source": "Origine",
        "contacts.exportHeaders.date": "Data",
        "contacts.exportSuccess": "Esportazione Completata",
        "contacts.exportSuccessDesc": "Il file CSV è stato scaricato con successo.",
        "contacts.exportError": "Errore di Esportazione",
        "contacts.exportErrorDesc": "Si è verificato un errore durante la generazione del file CSV."
    }
};

files.forEach(file => {
    const filePath = path.join(localesDir, file);
    const lang = file.replace('.json', '');

    if (tr[lang]) {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const db = JSON.parse(rawData);

        // Merge translations into dictionary
        Object.keys(tr[lang]).forEach(key => {
            db[key] = tr[lang][key];
        });

        fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf-8');
        console.log(`Updated CSV translations for ${file}`);
    }
});

console.log('CRM CSV translations injected to all languages!');
