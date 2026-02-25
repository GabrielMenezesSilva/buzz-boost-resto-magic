const { Client } = require('pg');
const fs = require('fs');

const connectionString = "postgresql://postgres.sfzqwxsxdgqaziacnrph:L8u1c3a2s8132@aws-1-eu-west-1.pooler.supabase.com:6543/postgres";

async function run() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log("🟢 Connected to Supabase successfully via pooler!");

        const sqlFiles = [
            './supabase/migrations/20260225000001_create_pos_tables.sql'
        ];

        for (const file of sqlFiles) {
            if (fs.existsSync(file)) {
                console.log(`Executing ${file}...`);
                const sql = fs.readFileSync(file, 'utf8');
                await client.query(sql);
                console.log(`✅ Success executing ${file}`);
            } else {
                console.log(`❌ File not found: ${file}`);
            }
        }
    } catch (err) {
        console.error("Database connection or execution error:", err);
    } finally {
        await client.end();
    }
}

run();
