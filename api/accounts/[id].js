const { sql, ensureSchema } = require('../_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const id = String(req.query.id || '').toUpperCase().replace(/[^A-Z0-9_\-.~:@+]/g, '').slice(0, 190);
  if (!id) { res.status(400).json({ error: 'Missing account id' }); return; }

  try {
    await ensureSchema();

    if (req.method === 'GET') {
      const rows = await sql`SELECT data FROM accounts WHERE id = ${id}`;
      if (!rows.length) { res.status(404).json({ error: 'Account not found', id }); return; }
      res.status(200).json(rows[0].data);
      return;
    }

    if (req.method === 'POST') {
      const record = typeof req.body === 'object' && req.body !== null ? req.body : JSON.parse(req.body || '{}');
      record.accountNumber = id;
      const clientName = record.clientName || null;
      await sql`
        INSERT INTO accounts (id, client_name, data, updated_at)
        VALUES (${id}, ${clientName}, ${JSON.stringify(record)}::jsonb, now())
        ON CONFLICT (id) DO UPDATE SET
          client_name = EXCLUDED.client_name,
          data = EXCLUDED.data,
          updated_at = now()
      `;
      res.status(200).json({ ok: true, id });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', detail: String((err && err.message) || err) });
  }
};
