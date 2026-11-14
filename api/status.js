import { db, ensureSchema } from '../lib/db.js';

export default async function handler(req, res) {
  try {
    const sql = db();
    let sources, totals;
    try {
      sources = await sql.query(
        `SELECT source_id, name, ok, last_ok, last_error, items, checked_at FROM source_status ORDER BY ok ASC, name ASC`
      );
      totals = await sql.query(
        `SELECT count(*)::int AS total,
                count(*) FILTER (WHERE fetched_at > now() - interval '24 hours')::int AS last24h
         FROM articles`
      );
    } catch (err) {
      if (err?.code !== '42P01') throw err;
      await ensureSchema();
      sources = [];
      totals = [{ total: 0, last24h: 0 }];
    }
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(200).json({
      total: totals[0].total,
      last24h: totals[0].last24h,
      sources: sources.map((s) => ({
        id: s.source_id,
        name: s.name,
        ok: s.ok,
        lastOk: s.last_ok ? new Date(s.last_ok).toISOString() : null,
        error: s.last_error,
        items: s.items,
        checkedAt: new Date(s.checked_at).toISOString(),
      })),
    });
  } catch (err) {
    res.status(500).json({ error: 'Impossible de lire l’état des sources', detail: String(err?.message || err) });
  }
}
