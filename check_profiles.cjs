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
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  if(error) console.error(error);
  else console.log(Object.keys(data[0] || {}));
}
run();
