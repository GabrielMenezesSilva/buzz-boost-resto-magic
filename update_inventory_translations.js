import fs from 'node:fs';
import path from 'node:path';

const localesDir = path.join(process.cwd(), 'src', 'locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

const tr = {
    "pt-BR": {
        "inventory.addStockBtn": "Entrada de Estoque",
        "inventory.addStockTitle": "Registrar Entrada",
        "inventory.addStockDesc": "Selecione o produto e a quantidade recebida. O sistema atualizará o saldo automaticamente.",
        "inventory.selectProduct": "Selecione um produto...",
        "inventory.amountToAdd": "Quantidade Recebida",
        "inventory.addReason": "Nota (Opcional)",
        "inventory.addReasonPlaceholder": "Ex: Compra de fornecedor XYZ...",
        "inventory.saveStock": "Confirmar Entrada"
    },
    "en": {
        "inventory.addStockBtn": "Add Stock",
        "inventory.addStockTitle": "Register Stock Entry",
        "inventory.addStockDesc": "Select the product and received quantity. The system will auto-update the balance.",
        "inventory.selectProduct": "Select a product...",
        "inventory.amountToAdd": "Quantity Received",
        "inventory.addReason": "Note (Optional)",
        "inventory.addReasonPlaceholder": "Ex: Purchase from supplier XYZ...",
        "inventory.saveStock": "Confirm Entry"
    },
    "es": {
        "inventory.addStockBtn": "Entrada de Stock",
        "inventory.addStockTitle": "Registrar Entrada",
        "inventory.addStockDesc": "Seleccione el producto y la cantidad recibida. El sistema actualizará el saldo.",
        "inventory.selectProduct": "Seleccione un producto...",
        "inventory.amountToAdd": "Cantidad Recibida",
        "inventory.addReason": "Nota (Opcional)",
        "inventory.addReasonPlaceholder": "Ej: Compra del proveedor XYZ...",
        "inventory.saveStock": "Confirmar Entrada"
    },
    "fr": {
        "inventory.addStockBtn": "Ajouter du Stock",
        "inventory.addStockTitle": "Enregistrer une Entrée",
        "inventory.addStockDesc": "Sélectionnez le produit et la quantité. Le système mettra à jour le solde.",
        "inventory.selectProduct": "Sélectionnez un produit...",
        "inventory.amountToAdd": "Quantité Reçue",
        "inventory.addReason": "Note (Optionnel)",
        "inventory.addReasonPlaceholder": "Ex : Achat fournisseur XYZ...",
        "inventory.saveStock": "Confirmer l'Entrée"
    },
    "de": {
        "inventory.addStockBtn": "Bestand Hinzufügen",
        "inventory.addStockTitle": "Eingang Registrieren",
        "inventory.addStockDesc": "Wählen Sie das Produkt und die Menge. Das System aktualisiert den Bestand.",
        "inventory.selectProduct": "Produkt wählen...",
        "inventory.amountToAdd": "Erhaltene Menge",
        "inventory.addReason": "Notiz (Optional)",
        "inventory.addReasonPlaceholder": "Bsp: Einkauf bei Lieferant XYZ...",
        "inventory.saveStock": "Eingang Bestätigen"
    },
    "it": {
        "inventory.addStockBtn": "Aggiungi Scorte",
        "inventory.addStockTitle": "Registra Ingresso",
        "inventory.addStockDesc": "Seleziona il prodotto e la quantità. Il sistema aggiornerà il saldo.",
        "inventory.selectProduct": "Seleziona un prodotto...",
        "inventory.amountToAdd": "Quantità Ricevuta",
        "inventory.addReason": "Nota (Opzionale)",
        "inventory.addReasonPlaceholder": "Es: Acquisto fornitore XYZ...",
        "inventory.saveStock": "Conferma Ingresso"
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
        console.log(`Updated Inventory translations for ${file}`);
    }
});

console.log('Inventory translations injected to all languages!');
