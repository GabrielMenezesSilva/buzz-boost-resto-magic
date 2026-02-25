const fs = require('fs');

const ptBrStrings = {
    "nav.products": "Produtos",
    "nav.categories": "Categorias",
    "nav.suppliers": "Fornecedores",
    "nav.inventory": "Estoque",
    "inventory.title": "Gerenciamento de Estoque",
    "inventory.subtitle": "Acompanhe e controle os níveis de estoque do seu negócio",
    "products.title": "Meus Produtos",
    "products.subtitle": "Catálogo completo de produtos e ingredientes",
    "products.new": "Novo Produto",
    "categories.title": "Categorias",
    "categories.subtitle": "Organize seu cardápio e ingredientes",
    "categories.new": "Nova Categoria",
    "suppliers.title": "Fornecedores",
    "suppliers.subtitle": "Gerencie seus contatos comercias e distribuidores",
    "suppliers.new": "Novo Fornecedor"
};

const enStrings = {
    "nav.products": "Products",
    "nav.categories": "Categories",
    "nav.suppliers": "Suppliers",
    "nav.inventory": "Inventory",
    "inventory.title": "Inventory Management",
    "inventory.subtitle": "Track and control your business stock levels",
    "products.title": "My Products",
    "products.subtitle": "Complete catalog of products and ingredients",
    "products.new": "New Product",
    "categories.title": "Categories",
    "categories.subtitle": "Organize your menu and ingredients",
    "categories.new": "New Category",
    "suppliers.title": "Suppliers",
    "suppliers.subtitle": "Manage your commercial contacts and distributors",
    "suppliers.new": "New Supplier"
};

const frStrings = {
    "nav.products": "Produits",
    "nav.categories": "Catégories",
    "nav.suppliers": "Fournisseurs",
    "nav.inventory": "Inventaire",
    "inventory.title": "Gestion des Stocks",
    "inventory.subtitle": "Suivez et contrôlez les niveaux de stock de votre entreprise",
    "products.title": "Mes Produits",
    "products.subtitle": "Catalogue complet de produits et ingrédients",
    "products.new": "Nouveau Produit",
    "categories.title": "Catégories",
    "categories.subtitle": "Organisez votre menu et vos ingrédients",
    "categories.new": "Nouvelle Catégorie",
    "suppliers.title": "Fournisseurs",
    "suppliers.subtitle": "Gérez vos contacts commerciaux et distributeurs",
    "suppliers.new": "Nouveau Fournisseur"
};

const itStrings = {
    "nav.products": "Prodotti",
    "nav.categories": "Categorie",
    "nav.suppliers": "Fornitori",
    "nav.inventory": "Inventario",
    "inventory.title": "Gestione dell'Inventario",
    "inventory.subtitle": "Tieni traccia e controlla i livelli di scorta della tua attività",
    "products.title": "I Miei Prodotti",
    "products.subtitle": "Catalogo completo di prodotti e ingredienti",
    "products.new": "Nuovo Prodotto",
    "categories.title": "Categorie",
    "categories.subtitle": "Organizza il tuo menu e i tuoi ingredienti",
    "categories.new": "Nuova Categoria",
    "suppliers.title": "Fornitori",
    "suppliers.subtitle": "Gestisci i tuoi contatti commerciali e distributori",
    "suppliers.new": "Nuovo Fornitore"
};

const deStrings = {
    "nav.products": "Produkte",
    "nav.categories": "Kategorien",
    "nav.suppliers": "Lieferanten",
    "nav.inventory": "Inventar",
    "inventory.title": "Bestandsverwaltung",
    "inventory.subtitle": "Verfolgen und kontrollieren Sie die Lagerbestände Ihres Unternehmens",
    "products.title": "Meine Produkte",
    "products.subtitle": "Kompletter Katalog von Produkten und Zutaten",
    "products.new": "Neues Produkt",
    "categories.title": "Kategorien",
    "categories.subtitle": "Organisieren Sie Ihr Menü und Ihre Zutaten",
    "categories.new": "Neue Kategorie",
    "suppliers.title": "Lieferanten",
    "suppliers.subtitle": "Verwalten Sie Ihre Geschäftskontakte und Distributoren",
    "suppliers.new": "Neuer Lieferant"
};

const extras = {
    "admin.tableRestaurants": "Restaurantes",
    "admin.tableContacts": "Contatos",
    "common.save": "Salvar",
    "common.cancel": "Cancelar",
    "common.edit": "Editar",
    "common.delete": "Excluir",
    "common.actions": "Ações",
    "common.name": "Nome",
    "common.description": "Descrição",
    "common.loading": "Carregando...",
    "common.success": "Sucesso",
    "common.error": "Erro"
};

const extrasEn = {
    "admin.tableRestaurants": "Restaurants",
    "admin.tableContacts": "Contacts",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.actions": "Actions",
    "common.name": "Name",
    "common.description": "Description",
    "common.loading": "Loading...",
    "common.success": "Success",
    "common.error": "Error"
};

const extrasFr = {
    "admin.tableRestaurants": "Restaurants",
    "admin.tableContacts": "Contacts",
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.edit": "Modifier",
    "common.delete": "Supprimer",
    "common.actions": "Actions",
    "common.name": "Nom",
    "common.description": "Description",
    "common.loading": "Chargement...",
    "common.success": "Succès",
    "common.error": "Erreur"
};

const extrasIt = {
    "admin.tableRestaurants": "Ristoranti",
    "admin.tableContacts": "Contatti",
    "common.save": "Salva",
    "common.cancel": "Annulla",
    "common.edit": "Modifica",
    "common.delete": "Elimina",
    "common.actions": "Azioni",
    "common.name": "Nome",
    "common.description": "Descrizione",
    "common.loading": "Caricamento...",
    "common.success": "Successo",
    "common.error": "Errore"
};

const extrasDe = {
    "admin.tableRestaurants": "Restaurants",
    "admin.tableContacts": "Kontakte",
    "common.save": "Speichern",
    "common.cancel": "Abbrechen",
    "common.edit": "Bearbeiten",
    "common.delete": "Löschen",
    "common.actions": "Aktionen",
    "common.name": "Name",
    "common.description": "Beschreibung",
    "common.loading": "Laden...",
    "common.success": "Erfolg",
    "common.error": "Fehler"
};


function readAndMerge(file, specificStrings, extraMap) {
    const content = fs.readFileSync(file, 'utf8');
    const d = JSON.parse(content);
    Object.assign(d, specificStrings, extraMap);
    fs.writeFileSync(file, JSON.stringify(d, null, 2) + '\n', 'utf8');
    console.log(`Updated ${file}`);
}

readAndMerge('src/locales/pt-BR.json', ptBrStrings, extras);
readAndMerge('src/locales/en.json', enStrings, extrasEn);
readAndMerge('src/locales/fr.json', frStrings, extrasFr);
readAndMerge('src/locales/it.json', itStrings, extrasIt);
readAndMerge('src/locales/de.json', deStrings, extrasDe);
