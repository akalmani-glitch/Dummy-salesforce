const { sql } = require('@vercel/postgres');

let ensured = false;

async function ensureSchema() {
  if (ensured) return;
  await sql`
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      client_name TEXT,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  ensured = true;
}

module.exports = { sql, ensureSchema };
