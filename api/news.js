import { db, ensureSchema } from '../lib/db.js';
import { buildNewsQuery } from '../lib/query.js';

export default async function handler(req, res) {
  try {
    const { text, params, limit } = buildNewsQuery(req.query);
    let rows;
    try {
      rows = await db().query(text, params);
    } catch (err) {
      if (err?.code !== '42P01') throw err;
      await ensureSchema();
      rows = [];
    }
    const items = rows.slice(0, limit).map((r) => ({
      id: String(r.id),
      url: r.url,
      title: r.title,
      summary: r.summary,
      source: r.source,
      lang: r.lang || 'fr',
      regions: String(r.regions).split(',').filter(Boolean),
      topics: String(r.topics).split(',').filter(Boolean),
      publishedAt: new Date(r.published_at).toISOString(),
    }));
    const last = items[items.length - 1];
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(200).json({
      items,
      next: rows.length > limit && last ? `${last.publishedAt}|${last.id}` : null,
    });
  } catch (err) {
    res.status(500).json({ error: 'Impossible de lire les actualités', detail: String(err?.message || err) });
  }
}
