const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const files = {
    'pt-BR.json': {
        categories: { new: "Nova Categoria", descNew: "Crie uma nova tag para organizar seus produtos.", color: "Cor de Identificação", tableDesc: "Gerencie as tags e organizadores do seu sistema.", tableColor: "Cor", empty: "Nenhuma categoria encontrada." },
        suppliers: { new: "Novo Fornecedor", descNew: "Cadastre um novo distribuidor ou contato comercial.", contactName: "Nome do Contato", phone: "Telefone / WhatsApp", email: "Email", notes: "Anotações Adicionais", tableContact: "Contato", tablePhone: "Telefone", tableEmail: "Email", empty: "Nenhum fornecedor encontrado." },
        products: { new: "Novo Produto", descNew: "Adicione um novo item ao seu catálogo e controle de inventário.", category: "Categoria", supplier: "Fornecedor", noCategory: "Sem categoria", noSupplier: "Sem fornecedor", costPrice: "Preço de Custo (R$)", sellPrice: "Preço de Venda (R$)", initialStock: "Estoque Inicial", minStock: "Estoque Mínimo (Alerta)", tableCategory: "Categoria", tablePrice: "Preço", tableStock: "Estoque", tableStatus: "Status", empty: "Nenhum produto cadastrado." },
        inventory: { product: "Produto", currentStock: "Estoque Atual", minimum: "Mínimo", expiryDate: "Data de Validade" },
        common: { confirmAction: "Tem certeza? Essa ação não pode ser desfeita.", active: "Ativo", inactive: "Inativo" }
    },
    'en.json': {
        categories: { new: "New Category", descNew: "Create a new tag to organize your products.", color: "Identification Color", tableDesc: "Manage the tags and organizers of your system.", tableColor: "Color", empty: "No categories found." },
        suppliers: { new: "New Supplier", descNew: "Register a new distributor or commercial contact.", contactName: "Contact Name", phone: "Phone / WhatsApp", email: "Email", notes: "Additional Notes", tableContact: "Contact", tablePhone: "Phone", tableEmail: "Email", empty: "No suppliers found." },
        products: { new: "New Product", descNew: "Add a new item to your catalog and inventory control.", category: "Category", supplier: "Supplier", noCategory: "No category", noSupplier: "No supplier", costPrice: "Cost Price ($)", sellPrice: "Sell Price ($)", initialStock: "Initial Stock", minStock: "Minimum Stock (Alert)", tableCategory: "Category", tablePrice: "Price", tableStock: "Stock", tableStatus: "Status", empty: "No products registered." },
        inventory: { product: "Product", currentStock: "Current Stock", minimum: "Minimum", expiryDate: "Expiry Date" },
        common: { confirmAction: "Are you sure? This action cannot be undone.", active: "Active", inactive: "Inactive" }
    },
    'es.json': {
        categories: { new: "Nueva Categoría", descNew: "Crea una nueva etiqueta para organizar tus productos.", color: "Color de Identificación", tableDesc: "Gestiona las etiquetas de tu sistema.", tableColor: "Color", empty: "No se encontraron categorías." },
        suppliers: { new: "Nuevo Proveedor", descNew: "Registra un nuevo contacto comercial.", contactName: "Nombre del Contacto", phone: "Teléfono / WhatsApp", email: "Email", notes: "Notas Adicionales", tableContact: "Contacto", tablePhone: "Teléfono", tableEmail: "Email", empty: "No se encontraron proveedores." },
        products: { new: "Nuevo Producto", descNew: "Añade un nuevo artículo al catálogo.", category: "Categoría", supplier: "Proveedor", noCategory: "Sin categoría", noSupplier: "Sin proveedor", costPrice: "Precio de Costo", sellPrice: "Precio de Venta", initialStock: "Stock Inicial", minStock: "Stock Mínimo", tableCategory: "Categoría", tablePrice: "Precio", tableStock: "Stock", tableStatus: "Estado", empty: "No hay productos registrados." },
        inventory: { product: "Producto", currentStock: "Stock Actual", minimum: "Mínimo", expiryDate: "Fecha de Caducidad" },
        common: { confirmAction: "¿Estás seguro? Esta acción no se puede deshacer.", active: "Activo", inactive: "Inactivo" }
    },
    'fr.json': {
        categories: { new: "Nouvelle Catégorie", descNew: "Créez une nouvelle balise pour organiser vos produits.", color: "Couleur", tableDesc: "Gérez les balises de votre système.", tableColor: "Couleur", empty: "Aucune catégorie trouvée." },
        suppliers: { new: "Nouveau Fournisseur", descNew: "Enregistrez un nouveau contact commercial.", contactName: "Nom du Contact", phone: "Téléphone / WhatsApp", email: "Email", notes: "Notes supplémentaires", tableContact: "Contact", tablePhone: "Téléphone", tableEmail: "Email", empty: "Aucun fournisseur trouvé." },
        products: { new: "Nouveau Produit", descNew: "Ajoutez un nouvel article au catalogue.", category: "Catégorie", supplier: "Fournisseur", noCategory: "Sans catégorie", noSupplier: "Sans fournisseur", costPrice: "Prix d'Achat", sellPrice: "Prix de Vente", initialStock: "Stock Initial", minStock: "Stock Minimum", tableCategory: "Catégorie", tablePrice: "Prix", tableStock: "Stock", tableStatus: "Statut", empty: "Aucun produit enregistré." },
        inventory: { product: "Produit", currentStock: "Stock Actuel", minimum: "Minimum", expiryDate: "Date d'Expiration" },
        common: { confirmAction: "Êtes-vous sûr ? Cette action est irréversible.", active: "Actif", inactive: "Inactif" }
    }
};

Object.keys(files).forEach(file => {
    const filePath = path.join(localesDir, file);
    let json = {};

    if (fs.existsSync(filePath)) {
        try {
            json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (e) { console.error(e); }
    }

    const updates = files[file];

    // Merge safely
    for (const section in updates) {
        if (!json[section]) json[section] = {};
        json[section] = { ...json[section], ...updates[section] };
    }

    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
    console.log(`Updated ${file}`);
});
console.log('Update translation process finished.');
