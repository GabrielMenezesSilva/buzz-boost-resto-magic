const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const files = ['pt-BR.json', 'en.json', 'es.json', 'fr.json'];

const inventoryMissing = {
  'pt-BR.json': {
    title: "Estoque",
    subtitle: "Painel de alertas, controle central e auditoria de estoque.",
    lowStock: "Estoque Baixo",
    lowStockDesc: "Produtos atingindo o limite mínimo estabelecido.",
    expiring: "Vencimento Próximo",
    expiringDesc: "Produtos que expiram nos próximos 30 dias.",
    allGood: "Tudo certo com o estoque!",
    noExpiring: "Nenhum produto próximo do vencimento."
  },
  'en.json': {
    title: "Inventory",
    subtitle: "Alert panel, central control and stock auditing.",
    lowStock: "Low Stock",
    lowStockDesc: "Products reaching the established minimum limit.",
    expiring: "Expiring Soon",
    expiringDesc: "Products expiring in the next 30 days.",
    allGood: "Everything is fine with the stock!",
    noExpiring: "No products near expiration."
  },
  'es.json': {
    title: "Inventario",
    subtitle: "Panel de control, auditoría de stock y alertas.",
    lowStock: "Stock Bajo",
    lowStockDesc: "Productos que alcanzan el límite mínimo establecido.",
    expiring: "Vencimiento Próximo",
    expiringDesc: "Productos que expiran en los próximos 30 días.",
    allGood: "¡Todo bién con el stock!",
    noExpiring: "Ningún producto cerca del vencimiento."
  },
  'fr.json': {
    title: "Inventaire",
    subtitle: "Tableau de bord, contrôle central et alertes.",
    lowStock: "Stock Faible",
    lowStockDesc: "Produits atteignant la limite minimale établie.",
    expiring: "Expiration Proche",
    expiringDesc: "Produits qui expirent dans les 30 prochains jours.",
    allGood: "Tout va bien avec le stock !",
    noExpiring: "Aucun produit proche de l'expiration."
  }
};

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  if (fs.existsSync(filePath)) {
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!json.inventory) json.inventory = {};
    json.inventory = { ...json.inventory, ...inventoryMissing[file] };
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
    console.log(`Fixed ${file}`);
  }
});
