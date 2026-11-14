// Liste des sources. Chaque source : id, nom, adresse du flux RSS, zones, thèmes automatiques,
// et lang ("en" pour les sources en anglais ; sinon français).
// Deux façons d’ajouter une source :
//   url:  l’adresse exacte du flux RSS
//   site: l’adresse d’une page (accueil d’un ministère, chaîne YouTube...) : le flux est trouvé automatiquement
// Les adresses sont testées à chaque mise à jour : l’état de chaque source est visible sur le site.
// Pour ajouter une source, copie une ligne et change les valeurs.

const BF = ['burkina'];
const AF = ['afrique'];
const EU = ['europe'];
const US = ['usa'];
const WD = ['monde'];
const VID = ['videos'];
const MIN = ['burkina', 'ministeres']; // Burkina + onglet Ministères

export const SOURCES = [
  // Burkina
  { id: 'lefaso', name: 'Lefaso.net', url: 'https://lefaso.net/spip.php?page=backend', regions: BF },
  { id: 'burkina24', name: 'Burkina24', url: 'https://burkina24.com/feed/', regions: BF },
  { id: 'sidwaya', name: 'Sidwaya', url: 'https://www.sidwaya.info/feed/', regions: BF },
  { id: 'aib', name: 'AIB', url: 'https://www.aib.media/feed/', regions: BF },
  { id: 'minutebf', name: 'Minute.bf', url: 'https://minute.bf/feed/', regions: BF },
  { id: 'omega', name: 'Radio Oméga', url: 'https://omegabf.info/feed/', regions: BF },
  { id: 'lepays', name: 'Le Pays', url: 'https://lepays.bf/feed/', regions: BF },
  // Burkina : gouvernement, présidence et Journal officiel
  { id: 'sig', name: 'SIG (Gouvernement)', site: 'https://gouvernement.gov.bf', regions: MIN, topics: ['politique'] },
  { id: 'sig-actus', name: 'SIG, actualités', url: 'https://gouvernement.gov.bf/actualites/feed/', regions: MIN, topics: ['politique'] },
  { id: 'sig-communiques', name: 'SIG, communiqués', url: 'https://gouvernement.gov.bf/communiques/feed/', regions: MIN, topics: ['politique'] },
  { id: 'sig-aes', name: 'SIG, espace AES', url: 'https://gouvernement.gov.bf/a-e-s/feed/', regions: ['burkina', 'ministeres', 'aes'], topics: ['politique', 'cooperation'] },
  { id: 'presidence', name: 'Présidence du Faso', site: 'https://www.presidencedufaso.bf', regions: MIN, topics: ['politique'] },
  { id: 'jobf', name: 'Journal officiel (JOBF)', site: 'https://www.jobf.gov.bf', regions: MIN, topics: ['politique'] },
  { id: 'allafrica-bf', name: 'allAfrica, Burkina', site: 'https://fr.allafrica.com/burkina/', regions: BF },
  // Burkina : ministères (pour en ajouter, copie une ligne avec "site:" et mets l’adresse du ministère)
  { id: 'min-finances', name: 'Ministère des Finances', site: 'https://www.finances.gov.bf', regions: MIN, topics: ['economie', 'politique'] },
  { id: 'min-sante', name: 'Ministère de la Santé', site: 'https://www.sante.gov.bf', regions: MIN, topics: ['sante', 'politique'] },
  { id: 'min-agriculture', name: 'Ministère de l’Agriculture', site: 'https://www.agriculture.gov.bf', regions: MIN, topics: ['agriculture', 'politique'] },
  { id: 'min-commerce', name: 'Ministère du Commerce', site: 'https://www.mica.gov.bf', regions: MIN, topics: ['economie', 'politique'] },
  { id: 'min-mines', name: 'Ministère des Mines', site: 'https://www.mines.gov.bf', regions: MIN, topics: ['economie', 'politique'] },
  // AES (Burkina, Mali, Niger) : médias du Mali et du Niger
  { id: 'maliweb', name: 'Maliweb', site: 'https://www.maliweb.net', regions: ['afrique', 'aes'] },
  { id: 'actuniger', name: 'ActuNiger', site: 'https://www.actuniger.com', regions: ['afrique', 'aes'] },
  // Afrique
  { id: 'rfi-afrique', name: 'RFI Afrique', url: 'https://www.rfi.fr/fr/afrique/rss', regions: AF },
  { id: 'f24-afrique', name: 'France 24 Afrique', url: 'https://www.france24.com/fr/afrique/rss', regions: AF },
  { id: 'jeune-afrique', name: 'Jeune Afrique', url: 'https://www.jeuneafrique.com/feed/', regions: AF },
  { id: 'bbc-afrique', name: 'BBC Afrique', url: 'https://feeds.bbci.co.uk/afrique/rss.xml', regions: AF },
  { id: 'lemonde-afrique', name: 'Le Monde Afrique', url: 'https://www.lemonde.fr/afrique/rss_full.xml', regions: AF },
  { id: 'ecofin', name: 'Agence Ecofin', site: 'https://www.agenceecofin.com', regions: AF, topics: ['economie'] },
  { id: 'africanews', name: 'Africanews', site: 'https://fr.africanews.com', regions: AF },
  // Europe : médias
  { id: 'euronews', name: 'Euronews', url: 'https://fr.euronews.com/rss?level=theme&name=news', regions: EU },
  { id: 'dw-fr', name: 'DW Français', url: 'https://rss.dw.com/rdf/rss-fr-all', regions: EU },
  { id: 'f24-europe', name: 'France 24 Europe', url: 'https://www.france24.com/fr/europe/rss', regions: EU },
  { id: 'lemonde-europe', name: 'Le Monde Europe', url: 'https://www.lemonde.fr/europe/rss_full.xml', regions: EU },
  { id: 'euractiv', name: 'Euractiv France', url: 'https://www.euractiv.fr/feed/', regions: EU },
  { id: 'politico-eu', name: 'Politico Europe', url: 'https://www.politico.eu/feed/', regions: EU, lang: 'en' },
  // Europe : institutions (la Commission européenne n’a pas de flux RSS officiel)
  { id: 'europarl-press', name: 'Parlement européen (communiqués)', url: 'https://www.europarl.europa.eu/rss/doc/press-releases/fr.xml', regions: EU, topics: ['politique'] },
  { id: 'europarl-news', name: 'Parlement européen (actualités)', url: 'https://www.europarl.europa.eu/rss/doc/articles/fr.xml', regions: EU, topics: ['politique'] },
  { id: 'ecb', name: 'Banque centrale européenne', url: 'https://www.ecb.europa.eu/rss/press.xml', regions: EU, topics: ['economie'], lang: 'en' },
  // États-Unis : gouvernement et institutions
  { id: 'whitehouse', name: 'Maison Blanche', url: 'https://www.whitehouse.gov/feed/', regions: US, topics: ['politique'], lang: 'en' },
  { id: 'statedept', name: 'Département d’État', url: 'https://www.state.gov/feed/', regions: US, topics: ['politique', 'cooperation'], lang: 'en' },
  { id: 'nist', name: 'NIST', url: 'https://www.nist.gov/news-events/news/rss.xml', regions: US, topics: ['politique', 'informatique'], lang: 'en' },
  { id: 'nist-cyber', name: 'NIST Cybersécurité', url: 'https://www.nist.gov/blogs/cybersecurity-insights/rss.xml', regions: US, topics: ['informatique'], lang: 'en' },
  // États-Unis : médias
  { id: 'npr', name: 'NPR', url: 'https://feeds.npr.org/1001/rss.xml', regions: US, lang: 'en' },
  { id: 'pbs', name: 'PBS NewsHour', url: 'https://www.pbs.org/newshour/feeds/rss/headlines', regions: US, lang: 'en' },
  { id: 'nyt', name: 'The New York Times', url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', regions: US, lang: 'en' },
  { id: 'thehill', name: 'The Hill', url: 'https://thehill.com/feed/', regions: US, topics: ['politique'], lang: 'en' },
  { id: 'politico-us', name: 'Politico', url: 'https://rss.politico.com/politics-news.xml', regions: US, topics: ['politique'], lang: 'en' },
  // Monde
  { id: 'rfi-monde', name: 'RFI', url: 'https://www.rfi.fr/fr/rss', regions: WD },
  { id: 'f24-monde', name: 'France 24', url: 'https://www.france24.com/fr/rss', regions: WD },
  // Intelligence artificielle (sites spécialisés)
  { id: 'mit-ia', name: 'MIT Technology Review (IA)', url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed', regions: WD, topics: ['ia'], lang: 'en' },
  { id: 'verge-ia', name: 'The Verge (IA)', url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', regions: WD, topics: ['ia'], lang: 'en' },
  { id: 'hf-blog', name: 'Hugging Face', url: 'https://huggingface.co/blog/feed.xml', regions: WD, topics: ['ia', 'informatique'], lang: 'en' },
  { id: 'venturebeat-ia', name: 'VentureBeat (IA)', url: 'https://venturebeat.com/category/ai/feed/', regions: WD, topics: ['ia'], lang: 'en' },
  { id: 'openai', name: 'OpenAI', url: 'https://openai.com/news/rss.xml', regions: WD, topics: ['ia'], lang: 'en' },
  { id: 'deepmind', name: 'Google DeepMind', url: 'https://deepmind.google/blog/rss.xml', regions: WD, topics: ['ia'], lang: 'en' },
  { id: 'google-ai', name: 'Google IA', url: 'https://blog.google/technology/ai/rss/', regions: WD, topics: ['ia'], lang: 'en' },
  { id: 'nvidia', name: 'NVIDIA', url: 'https://blogs.nvidia.com/feed/', regions: WD, topics: ['ia', 'informatique'], lang: 'en' },
  { id: 'aws-ml', name: 'AWS Machine Learning', url: 'https://aws.amazon.com/blogs/machine-learning/feed/', regions: WD, topics: ['ia', 'informatique'], lang: 'en' },
  { id: 'marktechpost', name: 'MarkTechPost', url: 'https://www.marktechpost.com/feed/', regions: WD, topics: ['ia'], lang: 'en' },
  { id: 'ai-news', name: 'AI News', url: 'https://www.artificialintelligence-news.com/feed/', regions: WD, topics: ['ia'], lang: 'en' },
  { id: 'importai', name: 'Import AI', url: 'https://importai.substack.com/feed', regions: WD, topics: ['ia'], lang: 'en' },
  { id: 'simonw', name: 'Simon Willison', url: 'https://simonwillison.net/atom/everything/', regions: WD, topics: ['ia', 'informatique'], lang: 'en' },
  { id: 'actuia', name: 'ActuIA', url: 'https://www.actuia.com/feed/', regions: WD, topics: ['ia'] },
  // Informatique et tech
  { id: 'hn', name: 'Hacker News', url: 'https://hnrss.org/frontpage', regions: WD, topics: ['informatique'], lang: 'en' },
  { id: 'techcrunch', name: 'TechCrunch', url: 'https://techcrunch.com/feed/', regions: WD, topics: ['informatique'], lang: 'en' },
  { id: 'ars', name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', regions: WD, topics: ['informatique'], lang: 'en' },
  { id: 'numerama', name: 'Numerama', url: 'https://www.numerama.com/feed/', regions: WD, topics: ['informatique'] },
  // Business en ligne et tech africaine
  { id: 'producthunt', name: 'Product Hunt', url: 'https://www.producthunt.com/feed', regions: WD, topics: ['business_en_ligne'], lang: 'en' },
  { id: 'tc-startups', name: 'TechCrunch Startups', url: 'https://techcrunch.com/category/startups/feed/', regions: WD, topics: ['business_en_ligne'], lang: 'en' },
  { id: 'techpoint', name: 'Techpoint Africa', url: 'https://techpoint.africa/feed/', regions: AF, topics: ['numerique', 'business_en_ligne'], lang: 'en' },
  { id: 'dba', name: 'Digital Business Africa', url: 'https://digitalbusiness.africa/feed/', regions: AF, topics: ['numerique', 'business_en_ligne'] },
  // Vidéos de créateurs YouTube (opinions, pas des informations vérifiées)
  { id: 'yt-investirpays', name: 'Investir au Pays (YouTube)', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC3O421TBmtszMUNKhfTzsZA', regions: VID, topics: ['business_en_ligne', 'economie'] },
  // Pour ajouter une chaîne : copie la ligne ci-dessous, mets le lien de la chaîne (ex : https://www.youtube.com/@NomDeLaChaine)
  // { id: 'yt-exemple', name: 'Nom de la chaîne (YouTube)', site: 'https://www.youtube.com/@NomDeLaChaine', regions: VID },
];
