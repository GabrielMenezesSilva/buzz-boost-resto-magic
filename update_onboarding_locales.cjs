const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const locales = ['pt-BR.json', 'en.json', 'es.json', 'fr.json', 'it.json'];

// Novas chaves para Onboarding
const newTranslations = {
    "onboarding": {
        "titleProfile": "Perfil do Restaurante",
        "descProfile": "Como seus clientes conhecerão você?",
        "titleProduct": "Primeiro Produto",
        "descProduct": "Cadastre o carro-chefe do seu cardápio.",
        "titleQR": "Configurar QR",
        "descQR": "Crie seu primeiro link de captura.",
        "titleDone": "Tudo Pronto!",
        "descDone": "Você está preparado para usar o sistema.",
        "restaurantName": "Nome do seu Restaurante ou Loja",
        "productName": "Nome do Produto (Opcional)",
        "productPrice": "Preço de Venda (R$)",
        "qrTitle": "Título Chamativo (Incentivo do QR)",
        "qrText": "Texto de Apoio",
        "finish": "Ir para o Dashboard",
        "successText": "Seu sistema DopplerDine já está pré-configurado e pronto para decolar."
    },
    "inventory": {
        "title": "Estoque",
        "subtitle": "Painel de alertas, controle central e auditoria de estoque.",
        "lowStock": "Estoque Baixo",
        "lowStockDesc": "Produtos atingindo o limite mínimo estabelecido.",
        "expiring": "Vencimento Próximo",
        "expiringDesc": "Produtos que expiram nos próximos 30 dias.",
        "allGood": "Tudo certo com o estoque!",
        "noExpiring": "Nenhum produto próximo do vencimento."
    }
};

locales.forEach(file => {
    const filePath = path.join(localesDir, file);
    if (fs.existsSync(filePath)) {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            const json = JSON.parse(data);

            json.onboarding = { ...json.onboarding, ...newTranslations.onboarding };
            json.inventory = { ...json.inventory, ...newTranslations.inventory };

            fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
            console.log(`Updated ${file}`);
        } catch (err) {
            console.error(`Error updating ${file}:`, err);
        }
    } else {
        console.log(`File not found: ${file}`);
    }
});

console.log('Update translation process finished.');
