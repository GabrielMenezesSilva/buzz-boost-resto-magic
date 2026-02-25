const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const ptBrFile = path.join(localesDir, 'pt-BR.json');

if (fs.existsSync(ptBrFile)) {
    const rawData = fs.readFileSync(ptBrFile, 'utf8');
    const json = JSON.parse(rawData);
    
    // Explicit manual injection of flat keys to PT-BR
    json['privacy.title'] = "Política de Privacidade e LGPD";
    json['privacy.lastUpdated'] = "Última atualização: Fevereiro de 2026";
    json['privacy.subtitle'] = "Seu restaurante seguro e em conformidade com as leis de proteção de dados.";
    json['privacy.intro'] = "A DopplerDine valoriza a privacidade dos seus dados e dos seus clientes. Explicamos aqui como coletamos, usamos e protegemos suas informações em conformidade com a Lei Geral de Proteção de Dados (LGPD).";
    json['privacy.dataCollectionTitle'] = "1. Coleta e Uso de Dados";
    json['privacy.dataCollectionText'] = "Coletamos informações necessárias para a prestação do serviço (nome, e-mail, telefone do lojista) e dados capturados via QR Code dos clientes do restaurante. Todos os dados coletados têm a finalidade exclusiva de alimentar suas campanhas e dashboard gerencial.";
    json['privacy.lgpdTitle'] = "2. Base Legal (LGPD)";
    json['privacy.lgpdText'] = "O tratamento de dados é realizado com base no consentimento fornecido pelo titular durante o cadastro e legitimo interesse para prestação dos nossos serviços de software SaaS.";
    json['privacy.securityTitle'] = "3. Segurança e Retenção";
    json['privacy.securityText'] = "Implementamos criptografia de ponta a ponta e rígidas políticas de acesso. Os dados são retidos apenas pelo tempo necessário para cumprir sua finalidade.";
    
    json['terms.title'] = "Termos de Serviço";
    json['terms.lastUpdated'] = "Última atualização: Fevereiro de 2026";
    json['terms.intro'] = "Bem-vindo ao DopplerDine. Ao utilizar nossa plataforma, você concorda expressamente com os termos estabelecidos abaixo e com nossa Política de Privacidade.";
    json['terms.usageTitle'] = "1. Condições de Uso";
    json['terms.usageText'] = "O DopplerDine oferece uma licença revogável, não exclusiva e intransferível para o uso de sua plataforma de CRM e Cardápios Digitais. Você é responsável por manter a confidencialidade da sua conta e senha.";
    json['terms.contentTitle'] = "2. Propriedade Intelectual";
    json['terms.contentText'] = "Todos os direitos, incluindo software, marcas e design, permanecem sendo propriedade exclusiva da DopplerDine. Você mantém total controle sobre os dados dos SEUS clientes coletados através dos nossos formulários.";
    json['terms.liabilityTitle'] = "3. Limitação de Responsabilidade";
    json['terms.liabilityText'] = "A plataforma é fornecida 'como está'. A DopplerDine não se responsabiliza por perda de lucros, interrupções no serviço com terceiros (ex: WhatsApp, Envios SMS) ou exclusão indevida de dados por parte do Lojista.";
    
    // Write back
    fs.writeFileSync(ptBrFile, JSON.stringify(json, null, 2), 'utf8');
    console.log("Injetado pt-BR Manualmente e finalizado o Flat.");
}
