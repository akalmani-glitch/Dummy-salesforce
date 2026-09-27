const { neon } = require('@neondatabase/serverless');

// Vercel's marketplace Postgres integrations (Neon, Supabase, etc.) let the
// installer pick a custom environment variable prefix, so the pooled
// connection string might land as DATABASE_URL, STORAGE_DATABASE_URL, or
// some other <PREFIX>_DATABASE_URL. Search for it instead of assuming one
// exact name, then fall back to scanning for anything that looks like a
// Postgres connection string.
function findConnectionString() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  if (process.env.POSTGRES_URL) return process.env.POSTGRES_URL;

  const prefixedKey = Object.keys(process.env)
    .filter(k => /DATABASE_URL$/.test(k) && !/UNPOOLED/.test(k))
    .sort()[0];
  if (prefixedKey) return process.env[prefixedKey];

  const anyPostgresUrl = Object.values(process.env)
    .find(v => typeof v === 'string' && /^postgres(ql)?:\/\//.test(v));
  return anyPostgresUrl || null;
}

const connectionString = findConnectionString();

if (!connectionString) {
  throw new Error('No database connection string found in the environment (expected DATABASE_URL or a prefixed variant).');
}

const sql = neon(connectionString);

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
