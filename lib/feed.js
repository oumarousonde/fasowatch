import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  removeNSPrefix: true,
  textNodeName: '#text',
  processEntities: true,
  htmlEntities: true,
});

const arr = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);

const text = (v) => {
  if (v == null) return '';
  if (typeof v === 'object') return text(v['#text'] ?? '');
  return String(v);
};

export const stripHtml = (s) =>
  String(s || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export function cleanUrl(u) {
  try {
    const url = new URL(String(u).trim());
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    for (const k of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid|gclid|mc_)/i.test(k)) url.searchParams.delete(k);
    }
    url.hash = '';
    return url.toString();
  } catch {
    return null;
  }
}

function linkOf(item) {
  const l = item.link;
  let href = '';
  if (typeof l === 'string') href = l;
  else if (Array.isArray(l)) {
    const alt = l.find((x) => x && typeof x === 'object' && (!x['@_rel'] || x['@_rel'] === 'alternate'));
    const pick = alt ?? l[0];
    href = typeof pick === 'string' ? pick : pick?.['@_href'] || text(pick);
  } else if (l && typeof l === 'object') href = l['@_href'] || text(l);
  if (!href) {
    const g = item.guid;
    const gv = text(g);
    if (/^https?:\/\//i.test(gv)) href = gv;
  }
  return cleanUrl(href);
}

function dateOf(item, now = new Date()) {
  const raw = text(item.pubDate ?? item.published ?? item.updated ?? item.date ?? item.created);
  const d = new Date(raw);
  if (!raw || isNaN(d)) return now;
  if (d.getTime() > now.getTime() + 3600_000) return now;
  return d;
}

export function parseFeed(xml, now = new Date()) {
  const obj = parser.parse(xml);
  const channel = arr(obj?.rss?.channel)[0];
  const raw = channel?.item ?? obj?.feed?.entry ?? obj?.RDF?.item ?? [];
  const out = [];
  for (const it of arr(raw)) {
    const title = stripHtml(text(it.title));
    const url = linkOf(it);
    if (!title || !url) continue;
    let summary = stripHtml(text(it.description ?? it.summary ?? it.encoded ?? it.content ?? it.group?.description));
    if (summary.length > 280) summary = summary.slice(0, 277).trimEnd() + '…';
    out.push({ title: title.slice(0, 300), url, summary, publishedAt: dateOf(it, now) });
  }
  return out;
}

const UA = 'FasoWatchBot/1.0 (news aggregator)';

async function get(url, accept) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      Accept: accept,
      'Accept-Language': 'fr,en;q=0.8',
      Cookie: 'CONSENT=YES+1; SOCS=CAI',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(9000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

// Cherche dans une page web la ligne qui annonce son flux RSS ou Atom.
export function findFeedLink(html, base) {
  for (const tag of String(html).match(/<link\b[^>]*>/gi) || []) {
    if (!/type=["']application\/(rss|atom)\+xml["']/i.test(tag)) continue;
    const m = tag.match(/href=["']([^"']+)["']/i);
    if (!m) continue;
    const href = m[1].replace(/&amp;/g, '&');
    if (/comments/i.test(href)) continue;
    try {
      return new URL(href, base).toString();
    } catch {}
  }
  return null;
}

// Une source a soit "url" (adresse directe du flux), soit "site" (adresse d’une page : le flux est trouvé tout seul).
export async function fetchFeed(source) {
  let url = source.url;
  if (!url) {
    const html = await get(source.site, 'text/html,application/xhtml+xml,*/*');
    url = findFeedLink(html, source.site);
    if (!url) throw new Error('Aucun flux RSS trouvé sur ce site');
  }
  const xml = await get(url, 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*');
  const items = parseFeed(xml);
  if (!items.length) throw new Error('Flux vide ou format non reconnu');
  return items;
}
