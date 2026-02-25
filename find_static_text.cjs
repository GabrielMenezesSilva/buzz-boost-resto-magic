const fs = require('fs');
const path = require('path');

const componentsToCheck = [
  'Dashboard.tsx', 'Contacts.tsx', 'Campaigns.tsx', 
  'Templates.tsx', 'Profile.tsx', 'Settings.tsx', 
  'Admin.tsx', 'Categories.tsx', 'Products.tsx', 
  'Suppliers.tsx', 'Inventory.tsx'
];

const pagesDir = path.join(__dirname, 'src', 'pages');

const checkFile = (filePath) => {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  let issuesFound = 0;
  console.log(`\n\n=== Analying ${path.basename(filePath)} ===`);

  lines.forEach((line, index) => {
    // Procura por texto que esteja entre tags JSX e que possua letras/palavras, exclui variaveis {var}
    const jsxTextRegex = />([^<{]+)[a-zA-Z]+([^<]+)</g;
    // Procura por strings hardcoded em placeholders: placeholder="Digite algo"
    const placeholderRegex = /placeholder="([^"]+)"/g;
    
    // Procura por labels Shadcn que recebem string literal: label="Nome"  title="Editar"
    const attrRegex = /(title|label)="([^"]+)"/g;

    let match;
    let foundLine = false;

    // Check JSX Text
    while ((match = jsxTextRegex.exec(line)) !== null) {
      if(match[0].trim().length > 2 && !line.includes('t(')) {
        console.log(`L${index + 1}: ${line.trim()}`);
        foundLine = true;
        issuesFound++;
      }
    }
    
    // Check placehloders
    if(!foundLine && (match = placeholderRegex.exec(line)) !== null) {
       if(!line.includes('t(')) {
        console.log(`L${index + 1}: ${line.trim()}`);
        foundLine = true;
        issuesFound++;
       }
    }

    // Check components attr
    if(!foundLine && (match = attrRegex.exec(line)) !== null) {
        if(!line.includes('t(') && match[2].length > 1) { // ex title="Q" n conta
            console.log(`L${index + 1}: ${line.trim()}`);
            issuesFound++;
        }
    }
  });

  if (issuesFound === 0) {
    console.log("Status: 100% Fully Translated ✨");
  } else {
    console.log(`Status: Found ${issuesFound} potential untranslated strings.`);
  }
};

componentsToCheck.forEach(comp => {
  const filePath = path.join(pagesDir, comp);
  checkFile(filePath);
});
