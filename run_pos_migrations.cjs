const { execSync } = require('child_process');
const fs = require('fs');

const connectionString = "postgresql://postgres.sfzqwxsxdgqaziacnrph:S62wX3V6yTqY@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require";
const sqlFiles = [
    './supabase/migrations/20260225000000_add_unique_phone_per_restaurant.sql',
    './supabase/migrations/20260225000001_create_pos_tables.sql'
];

async function run() {
    for (const file of sqlFiles) {
        if (fs.existsSync(file)) {
            console.log(`Running ${file}...`);
            try {
                const out = execSync(`psql "${connectionString}" -f "${file}"`, { encoding: 'utf-8', stdio: 'inherit' });
                console.log("Success.");
            } catch (e) {
                console.error(`Error running ${file}:`, e.message);
            }
        } else {
            console.log(`File not found: ${file}`);
        }
    }
}

run();
