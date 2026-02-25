const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');

const keysPtBR = {
    "home.dash.pos": "Caixa PDV",
    "home.dash.reports": "Relatórios",
    "home.dash.crm": "Clientes CRM",
    "home.dash.overviewTitle": "Visão Geral",
    "home.dash.overviewDesc": "Acompanhe suas vendas em tempo real.",
    "home.dash.search": "Pesquisar comanda...",
    "home.dash.salesToday": "Vendas Hoje",
    "home.dash.ticketsPaid": "Tickets Pagos",
    "home.dash.avgTicket": "Ticket Médio",
    "home.dash.tables": "Mesas do Salão",
    "home.dash.occupied": "Ocupada",
    "home.dash.free": "Livre",
    "home.dash.kds": "Cozinha (KDS)",

    "home.dash.order1.items": "2x Smash Frango, 1x Coca L...",
    "home.dash.order1.status": "Preparo",
    "home.dash.order1.time": "Agora",
    "home.dash.order2.items": "1x Pizza Média, 2x Heineken",
    "home.dash.order2.status": "Pronto",
    "home.dash.order2.time": "2 min",
    "home.dash.order3.items": "Água s/ Gás, Salada da Casa",
    "home.dash.order3.status": "Entregue",
    "home.dash.order3.time": "15 min",
    "home.dash.order4.items": "Executivo Picanha",
    "home.dash.order4.status": "Entregue",
    "home.dash.order4.time": "32 min"
};

const keysEn = {
    "home.dash.pos": "POS Register",
    "home.dash.reports": "Reports",
    "home.dash.crm": "CRM Clients",
    "home.dash.overviewTitle": "Overview",
    "home.dash.overviewDesc": "Track your sales in real time.",
    "home.dash.search": "Search orders...",
    "home.dash.salesToday": "Sales Today",
    "home.dash.ticketsPaid": "Tickets Paid",
    "home.dash.avgTicket": "Avg Ticket",
    "home.dash.tables": "Floor Tables",
    "home.dash.occupied": "Occupied",
    "home.dash.free": "Free",
    "home.dash.kds": "Kitchen (KDS)",

    "home.dash.order1.items": "2x Chicken Smash, 1x Coke",
    "home.dash.order1.status": "Prep",
    "home.dash.order1.time": "Now",
    "home.dash.order2.items": "1x Med Pizza, 2x Beer",
    "home.dash.order2.status": "Ready",
    "home.dash.order2.time": "2 min",
    "home.dash.order3.items": "Sparkling Water, House Salad",
    "home.dash.order3.status": "Delivered",
    "home.dash.order3.time": "15 min",
    "home.dash.order4.items": "Steak Special",
    "home.dash.order4.status": "Delivered",
    "home.dash.order4.time": "32 min"
};

function update(lang, data) {
    const filePath = path.join(localesDir, `${lang}.json`);
    if (!fs.existsSync(filePath)) return;
    let content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    for (const [key, val] of Object.entries(data)) {
        content[key] = val;
    }
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
}

update('pt-BR', keysPtBR);
update('en', keysEn);
['es', 'it', 'fr', 'de'].forEach(lang => update(lang, keysEn));
