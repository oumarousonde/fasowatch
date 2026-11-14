import assert from 'node:assert/strict';
import { parseFeed, cleanUrl, findFeedLink } from '../lib/feed.js';
import { classify, TOPIC_IDS } from '../lib/classify.js';
import { buildNewsQuery } from '../lib/query.js';
import { SOURCES } from '../lib/sources.js';

const now = new Date('2026-11-14T10:00:00Z');

const rss = `<?xml version="1.0"?><rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel><title>T</title>
<item><title><![CDATA[Burkina : l’école reprend & les élèves reviennent]]></title><link>https://exemple.bf/a1?utm_source=x&id=2</link><description><![CDATA[<p>Les <b>enseignants</b> sont prêts.</p>]]></description><pubDate>Sat, 14 Nov 2026 08:00:00 +0000</pubDate></item>
<item><title>Sans lien</title></item>
<item><title>Date future</title><link>https://exemple.bf/a3</link><pubDate>Mon, 01 Jan 2029 00:00:00 +0000</pubDate></item>
</channel></rss>`;
let items = parseFeed(rss, now);
assert.equal(items.length, 2);
assert.equal(items[0].title, 'Burkina : l’école reprend & les élèves reviennent');
assert.equal(items[0].url, 'https://exemple.bf/a1?id=2');
assert.equal(items[0].summary, 'Les enseignants sont prêts.');
assert.equal(items[1].publishedAt.getTime(), now.getTime());

const atom = `<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom"><entry><title>Atom un</title><link rel="alternate" href="https://exemple.com/x"/><updated>2026-11-14T07:00:00Z</updated><summary>Résumé</summary></entry></feed>`;
items = parseFeed(atom, now);
assert.equal(items.length, 1);
assert.equal(items[0].url, 'https://exemple.com/x');

const rdf = `<?xml version="1.0"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://purl.org/rss/1.0/" xmlns:dc="http://purl.org/dc/elements/1.1/"><item><title>RDF un</title><link>https://exemple.de/r1</link><dc:date>2026-11-14T06:00:00Z</dc:date></item></rdf:RDF>`;
items = parseFeed(rdf, now);
assert.equal(items.length, 1);
assert.equal(items[0].publishedAt.toISOString(), '2026-11-14T06:00:00.000Z');

assert.equal(cleanUrl('javascript:alert(1)'), null);
assert.equal(cleanUrl('ftp://x.y/z'), null);
assert.equal(cleanUrl('https://a.b/c#frag'), 'https://a.b/c');

const bf = { regions: ['burkina'] };
let c = classify({ title: 'Examens du BEPC : le ministre de l’Éducation rassure', summary: '' }, bf);
assert.ok(c.topics.includes(',education,') && c.topics.includes(',politique,'));
c = classify({ title: 'Attaque terroriste : l’armée riposte', summary: '' }, bf);
assert.ok(c.topics.includes(',securite,'));
c = classify({ title: 'OpenAI lance un nouveau modèle', summary: 'Intelligence artificielle générative' }, { regions: ['monde'] });
assert.ok(c.topics.includes(',ia,'));
c = classify({ title: 'Météo calme sur la région', summary: '' }, bf);
assert.equal(c.topics, ',autres,');
c = classify({ title: 'Sommet à Ouagadougou sur la coopération', summary: '' }, { regions: ['afrique'] });
assert.ok(c.regions.includes(',burkina,') && c.regions.includes(',afrique,'));
c = classify({ title: 'Il faut payer la facture', summary: 'rien' }, { regions: ['monde'] });
assert.ok(!c.topics.includes(',ia,'), 'le mot "ai" dans "paiement" ou "faire" ne doit pas déclencher IA');
c = classify({ title: 'Un nouveau framework', summary: '' }, { regions: ['monde'], topics: ['informatique'] });
assert.ok(c.topics.includes(',informatique,'));

let q = buildNewsQuery({});
assert.ok(!q.text.includes('WHERE') && q.params.length === 0 && q.limit === 40);
q = buildNewsQuery({ region: 'burkina', topic: 'sante', q: '50%', before: '2026-11-14T08:00:00.000Z|123', limit: '500' });
assert.equal(q.params.length, 5);
assert.ok(q.text.includes('LIMIT 101') && q.params[0] === '%,burkina,%' && q.params[2] === '%50\\%%');
q = buildNewsQuery({ region: 'x; DROP TABLE articles', topic: 'nimporte', before: 'abc|1' });
assert.equal(q.params.length, 0);

const ids = SOURCES.map((s) => s.id);
assert.equal(new Set(ids).size, ids.length, 'ids de sources uniques');
for (const s of SOURCES) assert.ok(/^https:\/\//.test(s.url || s.site) && s.regions?.length, s.id);

c = classify({ title: 'La Maison Blanche annonce de nouvelles sanctions', summary: '' }, { regions: ['monde'] });
assert.ok(c.regions.includes(',usa,'), 'zone États-Unis détectée dans le texte');
c = classify({ title: 'La Commission européenne propose une loi', summary: '' }, { regions: ['monde'] });
assert.ok(c.regions.includes(',europe,'), 'zone Europe détectée dans le texte');
c = classify({ title: 'Annonce du bureau', summary: '' }, { regions: ['usa'], topics: ['politique'] });
assert.ok(c.regions === ',usa,' && c.topics.includes(',politique,'));
q = buildNewsQuery({ region: 'usa' });
assert.equal(q.params[0], '%,usa,%');
for (const s of SOURCES) assert.ok(!s.lang || s.lang === 'en', 'lang valide: ' + s.id);
assert.ok(SOURCES.some((s) => s.regions.includes('usa')) && SOURCES.filter((s) => s.topics?.includes('ia')).length >= 8);

// Découverte automatique du flux
const html = `<html><head><link rel="alternate" type="application/rss+xml" title="Commentaires" href="/comments/feed/"><link rel='alternate' type='application/rss+xml' title='Actus' href='/feed/?a=1&amp;b=2'></head></html>`;
assert.equal(findFeedLink(html, 'https://exemple.gov.bf/accueil'), 'https://exemple.gov.bf/feed/?a=1&b=2');
assert.equal(findFeedLink('<html><head></head></html>', 'https://x.y'), null);
const yt = `<?xml version="1.0"?><feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom"><entry><id>yt:video:abc</id><title>Comment démarrer en trading</title><link rel="alternate" href="https://www.youtube.com/watch?v=abc"/><published>2026-11-14T05:00:00+00:00</published><media:group><media:title>Comment démarrer</media:title><media:description>Description de la vidéo</media:description></media:group></entry></feed>`;
items = parseFeed(yt, now);
assert.equal(items.length, 1);
assert.equal(items[0].url, 'https://www.youtube.com/watch?v=abc');
assert.equal(items[0].summary, 'Description de la vidéo');

c = classify({ title: 'Débuter en trading : forex et crypto expliqués', summary: '' }, { regions: ['videos'] });
assert.ok(c.topics.includes(',trading,'));
c = classify({ title: 'Une bourse d’études pour les élèves', summary: '' }, { regions: ['burkina'] });
assert.ok(!c.topics.includes(',trading,'), 'une bourse d’études n’est pas du trading');
c = classify({ title: 'Sommet de la Confédération AES à Niamey', summary: '' }, { regions: ['afrique'] });
assert.ok(c.regions.includes(',aes,'));
c = classify({ title: 'Le Sahel face aux défis', summary: '' }, { regions: ['monde'] });
assert.ok(c.regions.includes(',aes,'));

const ALLOWED = new Set(['burkina', 'ministeres', 'aes', 'afrique', 'europe', 'usa', 'monde', 'videos']);
for (const s of SOURCES) {
  assert.ok(s.url || s.site, 'url ou site : ' + s.id);
  assert.ok(!(s.url && s.site), 'pas les deux : ' + s.id);
  for (const r of s.regions) assert.ok(ALLOWED.has(r), `zone inconnue ${r} : ${s.id}`);
  for (const t of s.topics || []) assert.ok(TOPIC_IDS.has(t), `thème inconnu ${t} : ${s.id}`);
}
q = buildNewsQuery({ region: 'videos', topic: 'trading' });
assert.equal(q.params.length, 2);

c = classify({ title: 'Le ministre de la Santé lance une campagne', summary: '' }, { regions: ['burkina'] });
assert.ok(c.regions.includes(',ministeres,') && c.topics.includes(',sante,'));
c = classify({ title: 'Le ministre français visite Paris', summary: '' }, { regions: ['europe'] });
assert.ok(!c.regions.includes(',ministeres,'), 'Ministères : seulement le Burkina');
c = classify({ title: 'Campagne agricole : distribution d’engrais aux producteurs', summary: '' }, { regions: ['burkina'] });
assert.ok(c.topics.includes(',agriculture,'));
const mins = SOURCES.filter((s) => s.regions.includes('ministeres')).map((s) => s.id);
for (const id of ['min-sante', 'min-agriculture', 'min-finances', 'sig-communiques', 'presidence', 'jobf']) assert.ok(mins.includes(id), id);

console.log('Tous les tests passent');
