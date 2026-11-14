import { db, ensureSchema } from '../lib/db.js';
import { isAdmin, sleep } from '../lib/auth.js';
import { cleanUrl } from '../lib/feed.js';

const PLATFORMS = new Set(['tiktok', 'facebook', 'whatsapp', 'youtube', 'x', 'autre']);

export default async function handler(req, res) {
  try {
    const sql = db();
    if (req.method === 'GET') {
      let rows;
      try {
        rows = await sql.query(`SELECT id, url, title, note, platform, created_at FROM tips ORDER BY created_at DESC, id DESC LIMIT 100`);
      } catch (err) {
        if (err?.code !== '42P01') throw err;
        await ensureSchema();
        rows = [];
      }
      res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=120');
      return res.status(200).json({
        items: rows.map((r) => ({
          id: String(r.id),
          url: r.url,
          title: r.title,
          note: r.note,
          platform: r.platform,
          createdAt: new Date(r.created_at).toISOString(),
        })),
      });
    }

    if (req.method === 'POST' || req.method === 'DELETE') {
      if (!isAdmin(req)) {
        await sleep(700);
        return res.status(401).json({ error: 'Mot de passe incorrect' });
      }
      await ensureSchema();
      if (req.method === 'DELETE') {
        const id = String(req.query.id || '');
        if (!/^\d+$/.test(id)) return res.status(400).json({ error: 'Identifiant invalide' });
        await sql.query(`DELETE FROM tips WHERE id = $1::bigint`, [id]);
        return res.status(200).json({ ok: true });
      }
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
      const url = cleanUrl(body.url);
      const title = String(body.title || '').trim().slice(0, 200);
      const note = String(body.note || '').trim().slice(0, 500);
      const platform = PLATFORMS.has(body.platform) ? body.platform : 'autre';
      if (!url) return res.status(400).json({ error: 'Lien invalide (il doit commencer par http ou https)' });
      if (!title) return res.status(400).json({ error: 'Le titre est obligatoire' });
      await sql.query(`INSERT INTO tips (url, title, note, platform) VALUES ($1, $2, $3, $4)`, [url, title, note, platform]);
      return res.status(201).json({ ok: true });
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    res.status(405).json({ error: 'Méthode non autorisée' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', detail: String(err?.message || err) });
  }
}
