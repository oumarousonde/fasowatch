import { db, ensureSchema } from '../lib/db.js';
import { isCron } from '../lib/auth.js';
import { SOURCES } from '../lib/sources.js';
import { fetchFeed } from '../lib/feed.js';
import { classify } from '../lib/classify.js';

const KEEP_DAYS = 60;

async function markStatus(sql, source, ok, items, error) {
  if (ok) {
    await sql.query(
      `INSERT INTO source_status (source_id, name, ok, last_ok, last_error, items, checked_at)
       VALUES ($1, $2, true, now(), NULL, $3, now())
       ON CONFLICT (source_id) DO UPDATE SET name = EXCLUDED.name, ok = true, last_ok = now(),
         last_error = NULL, items = EXCLUDED.items, checked_at = now()`,
      [source.id, source.name, items]
    );
  } else {
    await sql.query(
      `INSERT INTO source_status (source_id, name, ok, last_error, items, checked_at)
       VALUES ($1, $2, false, $3, 0, now())
       ON CONFLICT (source_id) DO UPDATE SET name = EXCLUDED.name, ok = false,
         last_error = EXCLUDED.last_error, items = 0, checked_at = now()`,
      [source.id, source.name, String(error).slice(0, 200)]
    );
  }
}

async function refreshSource(sql, source) {
  try {
    const limitDate = Date.now() - KEEP_DAYS * 86400_000;
    const items = (await fetchFeed(source))
      .filter((i) => i.publishedAt.getTime() > limitDate)
      .slice(0, 100);
    const rows = items.map((i) => ({ ...i, ...classify(i, source) }));
    let added = 0;
    if (rows.length) {
      const res = await sql.query(
        `INSERT INTO articles (url, title, summary, source_id, source, regions, topics, published_at, lang)
         SELECT * FROM unnest($1::text[], $2::text[], $3::text[], $4::text[], $5::text[], $6::text[], $7::text[], $8::timestamptz[], $9::text[])
         ON CONFLICT (url) DO NOTHING
         RETURNING id`,
        [
          rows.map((r) => r.url),
          rows.map((r) => r.title),
          rows.map((r) => r.summary),
          rows.map(() => source.id),
          rows.map(() => source.name),
          rows.map((r) => r.regions),
          rows.map((r) => r.topics),
          rows.map((r) => r.publishedAt.toISOString()),
          rows.map(() => source.lang || 'fr'),
        ]
      );
      added = res.length;
    }
    await markStatus(sql, source, true, items.length, null);
    return { id: source.id, ok: true, read: items.length, added };
  } catch (err) {
    try {
      await markStatus(sql, source, false, 0, err?.message || err);
    } catch {}
    return { id: source.id, ok: false, error: String(err?.message || err).slice(0, 120) };
  }
}

async function mapPool(items, size, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i]);
      }
    })
  );
  return out;
}

export default async function handler(req, res) {
  if (!isCron(req)) return res.status(401).json({ error: 'Non autorisé' });
  try {
    await ensureSchema();
    const sql = db();
    const results = await mapPool(SOURCES, 12, (s) => refreshSource(sql, s));
    await sql.query(`DELETE FROM articles WHERE published_at < now() - interval '${KEEP_DAYS} days'`);
    const ok = results.filter((r) => r.ok).length;
    const added = results.reduce((n, r) => n + (r.added || 0), 0);
    res.status(200).json({ sources: SOURCES.length, ok, failed: SOURCES.length - ok, added, results });
  } catch (err) {
    res.status(500).json({ error: String(err?.message || err) });
  }
}
