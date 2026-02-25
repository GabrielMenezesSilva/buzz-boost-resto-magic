const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf8');
const lines = envFile.split('\n');
let url = '', key = '';
lines.forEach(l => {
  if(l.startsWith('VITE_SUPABASE_URL=')) url = l.split('=')[1].replace(/"/g, '').trim();
  if(l.startsWith('VITE_SUPABASE_PUBLISHABLE_KEY=')) key = l.split('=')[1].replace(/"/g, '').trim();
});

const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase.from('profiles').select('qr_code').limit(1);
  if(error) {
    console.error("Erro:", error);
  } else if(data && data.length > 0) {
    console.log(`URL do Form: http://localhost:8080/form/${data[0].qr_code}`);
  } else {
    console.log("Nenhum perfil encontrado com qr_code");
  }
}
run();
