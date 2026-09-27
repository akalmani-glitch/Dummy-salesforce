const { sql, ensureSchema } = require('../_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }

  try {
    await ensureSchema();
    const rows = await sql`
      SELECT id, client_name AS "clientName", updated_at AS "updatedAt"
      FROM accounts
      ORDER BY updated_at DESC
    `;
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error', detail: String((err && err.message) || err) });
  }
};
