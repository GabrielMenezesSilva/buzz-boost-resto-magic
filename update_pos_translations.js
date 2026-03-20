import fs from 'node:fs';
import path from 'node:path';

const localesDir = path.join(process.cwd(), 'src', 'locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

const tr = {
    "pt-BR": {
        "pos.orderSentSuccess": "Venda realizada com sucesso!",
        "pos.orderSentError": "Erro ao finalizar a venda.",
        "pos.selectTableError": "Selecione uma mesa para enviar o pedido para a cozinha.",
        "pos.cancel": "Cancelar",
        "pos.sendOrder": "Cobrar",
        "pos.loading": "Carregando Caixa...",
        "pos.cash": "Dinheiro",
        "pos.card": "Cartão",
        "pos.pix": "Pix"
    },
    "en": {
        "pos.orderSentSuccess": "Sale completed successfully!",
        "pos.orderSentError": "Error completing the sale.",
        "pos.selectTableError": "Select a table to send the order to the kitchen.",
        "pos.cancel": "Cancel",
        "pos.sendOrder": "Charge",
        "pos.loading": "Loading Register...",
        "pos.cash": "Cash",
        "pos.card": "Card",
        "pos.pix": "Pix"
    },
    "es": {
        "pos.orderSentSuccess": "¡Venta completada con éxito!",
        "pos.orderSentError": "Error al finalizar la venta.",
        "pos.selectTableError": "Seleccione una mesa para enviar el pedido a la cocina.",
        "pos.cancel": "Cancelar",
        "pos.sendOrder": "Cobrar",
        "pos.loading": "Cargando Caja...",
        "pos.cash": "Efectivo",
        "pos.card": "Tarjeta",
        "pos.pix": "Pix"
    },
    "de": {
        "pos.orderSentSuccess": "Verkauf erfolgreich abgeschlossen!",
        "pos.orderSentError": "Fehler beim Abschluss des Verkaufs.",
        "pos.selectTableError": "Wählen Sie einen Tisch, um die Bestellung an die Küche zu senden.",
        "pos.cancel": "Abbrechen",
        "pos.sendOrder": "Abrechnen",
        "pos.loading": "Kasse wird geladen...",
        "pos.cash": "Bargeld",
        "pos.card": "Karte",
        "pos.pix": "Pix"
    },
    "fr": {
        "pos.orderSentSuccess": "Vente finalisée avec succès !",
        "pos.orderSentError": "Erreur lors de la finalisation de la vente.",
        "pos.selectTableError": "Sélectionnez une table pour envoyer la commande en cuisine.",
        "pos.cancel": "Annuler",
        "pos.sendOrder": "Encaisser",
        "pos.loading": "Chargement de la caisse...",
        "pos.cash": "Espèces",
        "pos.card": "Carte",
        "pos.pix": "Pix"
    },
    "it": {
        "pos.orderSentSuccess": "Vendita completata con successo!",
        "pos.orderSentError": "Errore nel completamento della vendita.",
        "pos.selectTableError": "Seleziona un tavolo per inviare l'ordine in cucina.",
        "pos.cancel": "Annulla",
        "pos.sendOrder": "Incassare",
        "pos.loading": "Caricamento cassa...",
        "pos.cash": "Contanti",
        "pos.card": "Carta",
        "pos.pix": "Pix"
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
        console.log(`Updated POS translations for ${file}`);
    }
});

console.log('POS translations injected to all languages!');
