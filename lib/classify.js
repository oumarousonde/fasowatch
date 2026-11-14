// Classement par thème et par zone, avec des mots-clés (gratuit, mais pas parfait).
// Un mot qui finit par ! doit être trouvé tel quel (mot entier). Les autres sont cherchés en début de mot.

export const TOPICS = [
  ['securite', 'Sécurité'],
  ['politique', 'Gouvernement'],
  ['social', 'Social'],
  ['economie', 'Économie'],
  ['numerique', 'Numérique'],
  ['ia', 'IA'],
  ['cooperation', 'Coopération'],
  ['education', 'Éducation'],
  ['sante', 'Santé'],
  ['agriculture', 'Agriculture'],
  ['culture_sport', 'Culture et sport'],
  ['informatique', 'Informatique'],
  ['business_en_ligne', 'Business en ligne'],
  ['trading', 'Trading et crypto'],
  ['autres', 'Autres'],
];
export const TOPIC_IDS = new Set(TOPICS.map(([id]) => id));

const RULES = {
  securite: ['attaque', 'terroris', 'jihad', 'djihad', 'armee', 'militaire', 'soldat', 'vdp!', 'forces de defense', 'securite', 'insecurite', 'gendarmerie', 'police', 'embuscade', 'guerre', 'coup d\'etat', 'otage', 'explosion', 'army', 'military', 'attack', 'war!', 'security forces', 'defense', 'frappe', 'conflit'],
  politique: ['gouvernement', 'ministre', 'president', 'premier ministre', 'assemblee', 'parlement', 'election', 'transition', 'conseil des ministres', 'depute', 'senat', 'decret', 'politique', 'capitaine', 'junte', 'government', 'minister', 'parliament', 'congress', 'campagne', 'opposition', 'constitution'],
  social: ['social', 'syndicat', 'greve', 'emploi', 'chomage', 'jeunesse', 'femmes!', 'genre!', 'famille', 'logement', 'migrant', 'migration', 'pauvrete', 'retraite', 'droits humains', 'deplace', 'humanitaire', 'strike', 'housing', 'societe', 'solidarite', 'protestation', 'manifestation'],
  economie: ['economie', 'economique', 'budget', 'inflation', 'croissance', 'fmi!', 'banque mondiale', 'investissement', 'commerce', 'exportation', 'importation', 'agricult', 'prix!', 'finance', 'fiscal', 'impot', 'douane', 'economy', 'market', 'bank', 'trade', 'gdp!', 'entreprise', 'industrie', 'minier', 'coton', 'or!', 'cacao', 'petrole', 'energie', 'electricite'],
  numerique: ['numerique', 'digital', 'internet', 'telecom', '5g!', 'fibre optique', 'cyber', 'donnees', 'startup', 'application', 'mobile money', 'orange money', 'moov', 'e-gouvernance', 'data!', 'cloud', 'software', 'reseaux sociaux', 'tiktok', 'facebook', 'whatsapp', 'ordinateur', 'smartphone'],
  ia: ['intelligence artificielle', 'ia!', 'ai!', 'chatgpt', 'openai', 'anthropic', 'claude!', 'gemini', 'llm!', 'machine learning', 'deep learning', 'modele de langage', 'gpt', 'copilot', 'mistral', 'deepseek', 'artificial intelligence', 'generative', 'generatif', 'agent ia', 'ai agent', 'neural', 'robot'],
  cooperation: ['cooperation', 'partenariat', 'accord', 'diplomat', 'ambassade', 'aes!', 'cedeao', 'ecowas', 'union africaine', 'onu!', 'nations unies', 'union europeenne', 'bailleur', 'usaid', 'russie', 'chine!', 'chinois', 'turquie', 'bilateral', 'sommet', 'treaty', 'summit', 'cooperation', 'sanction', 'otan', 'nato'],
  education: ['education', 'ecole', 'eleve', 'enseignant', 'universite', 'etudiant', 'bac!', 'bepc', 'cep!', 'examen', 'concours', 'formation', 'lycee', 'bourse', 'school', 'university', 'student', 'scolaire', 'apprentissage', 'recherche scientifique'],
  sante: ['sante', 'hopital', 'maladie', 'paludisme', 'epidemie', 'vaccin', 'medecin', 'cholera', 'dengue', 'ebola', 'covid', 'sida!', 'vih!', 'nutrition', 'health', 'hospital', 'disease', 'vaccine', 'oms!', 'who!', 'medicament', 'clinique', 'cancer', 'mpox'],
  culture_sport: ['culture', 'musique', 'festival', 'cinema', 'fespaco', 'artiste', 'football', 'etalons', 'can!', 'match!', 'sport', 'athlet', 'olympi', 'concert', 'theatre', 'film!', 'music', 'soccer', 'championship', 'ligue des champions', 'litterature', 'roman!', 'danse', 'tournoi', 'basket', 'cyclisme', 'tour du faso'],
  informatique: ['programmation', 'developpeur', 'developer', 'github', 'open source', 'open-source', 'linux', 'python', 'javascript', 'typescript', 'api!', 'framework', 'cybersecurite', 'hacker', 'devops', 'database', 'vulnerabilit', 'malware', 'ransomware', 'code!', 'rust!', 'kubernetes', 'docker', 'processeur', 'gpu!', 'android', 'ios!'],
  business_en_ligne: ['startup', 'e-commerce', 'ecommerce', 'saas!', 'freelance', 'marketing', 'seo!', 'affiliation', 'dropshipping', 'createur de contenu', 'creator', 'influence', 'monetis', 'revenue', 'levee de fonds', 'funding', 'raises', 'product hunt', 'indie', 'side project', 'newsletter', 'business en ligne', 'fintech', 'paiement en ligne', 'shopify', 'vendre en ligne', 'abonnement', 'subscription', 'e-commerce'],
};

RULES.agriculture = ['agricult', 'agropastoral', 'agro-pastoral', 'recolte', 'campagne agricole', 'engrais', 'semence', 'elevage', 'eleveur', 'cultivateur', 'producteur', 'cereale', 'irrigation', 'pisciculture', 'halieutique', 'souverainete alimentaire', 'securite alimentaire', 'agropole', 'maraich', 'riz!', 'mais!', 'sorgho', 'cajou', 'karite', 'cotonnier', 'agro!'];
RULES.trading = ['trading', 'trader', 'forex', 'crypto', 'bitcoin', 'ethereum', 'brvm', 'analyse technique', 'scalping', 'day trading', 'propfirm', 'prop firm', 'metatrader', 'la bourse', 'wall street', 'marches financiers', 'cac 40', 'nasdaq', 'actions!', 'etf!'];

const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const COMPILED = Object.entries(RULES).map(([id, words]) => [
  id,
  new RegExp(
    words
      .map((w) => (w.endsWith('!') ? `\\b${esc(norm(w.slice(0, -1)))}\\b` : `\\b${esc(norm(w))}`))
      .join('|')
  ),
]);

const BURKINA_RE = /\b(burkina|burkinab|ouagadougou|bobo-dioulasso|bobo dioulasso|faso)/;
const MINISTRY_RE = /\bministere|\bministre|conseil des ministres|porte-parole du gouvernement|\bsecretaire general du ministere/;
const AES_RE = /\baes\b|\bsahel|confederation des etats du sahel|alliance des etats du sahel/;
const USA_RE = /\b(etats-unis|etats unis|americain|maison blanche|white house|pentagone|congres americain|united states)|\busa\b|\bu\.s\./;
const EUROPE_RE = /\b(union europeenne|commission europeenne|parlement europeen|conseil europeen|bruxelles|european union|european commission|zone euro|eurozone|von der leyen)/;

export function classify({ title, summary }, source) {
  const text = norm(`${title} ${summary}`);
  const topics = new Set(source.topics || []);
  for (const [id, re] of COMPILED) if (re.test(text)) topics.add(id);
  if (topics.size === 0) topics.add('autres');
  const regions = new Set(source.regions);
  if (!regions.has('burkina') && BURKINA_RE.test(text)) regions.add('burkina');
  if (regions.has('burkina') && !regions.has('ministeres') && MINISTRY_RE.test(text)) regions.add('ministeres');
  if (!regions.has('aes') && AES_RE.test(text)) regions.add('aes');
  if (!regions.has('usa') && USA_RE.test(text)) regions.add('usa');
  if (!regions.has('europe') && EUROPE_RE.test(text)) regions.add('europe');
  return {
    regions: `,${[...regions].join(',')},`,
    topics: `,${[...topics].join(',')},`,
  };
}
