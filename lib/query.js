import { TOPIC_IDS } from './classify.js';

const REGIONS = new Set(['burkina', 'ministeres', 'aes', 'afrique', 'europe', 'usa', 'monde', 'videos']);

export function buildNewsQuery({ region, topic, q, before, limit } = {}) {
  const where = [];
  const p = [];
  const add = (v) => {
    p.push(v);
    return `$${p.length}`;
  };
  if (REGIONS.has(region)) where.push(`regions LIKE ${add(`%,${region},%`)}`);
  if (topic && TOPIC_IDS.has(topic)) where.push(`topics LIKE ${add(`%,${topic},%`)}`);
  const term = String(q || '').trim().slice(0, 80);
  if (term) {
    const t = add(`%${term.replace(/[\\%_]/g, '\\$&')}%`);
    where.push(`(title ILIKE ${t} OR summary ILIKE ${t})`);
  }
  if (before) {
    const [ts, id] = String(before).split('|');
    if (!isNaN(Date.parse(ts)) && /^\d+$/.test(id || '')) {
      where.push(`(published_at, id) < (${add(ts)}::timestamptz, ${add(id)}::bigint)`);
    }
  }
  const lim = Math.min(Math.max(parseInt(limit, 10) || 40, 1), 100);
  const text = `SELECT id, url, title, summary, source, regions, topics, published_at, lang FROM articles ${
    where.length ? 'WHERE ' + where.join(' AND ') : ''
  } ORDER BY published_at DESC, id DESC LIMIT ${lim + 1}`;
  return { text, params: p, limit: lim };
}
