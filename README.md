# FasoWatch, le radar de l’actualité

Un site qui rassemble l’actualité du Burkina, de l’Afrique, de l’Europe (médias et institutions), des États-Unis (médias et gouvernement) et du monde, avec l’IA, l’informatique et le business en ligne. Les articles en anglais portent la mention « EN ». Tout est classé par zone et par thème. L’onglet « Tout » montre tous les articles de toutes les sources.

## Ce qu’il te faut (tout est gratuit)

1. Un compte GitHub
2. Un compte Vercel
3. Une base Neon (le lien de connexion commence par `postgresql://`)
4. Deux mots de passe que tu inventes : un pour la mise à jour automatique (`CRON_SECRET`), un pour la page admin (`ADMIN_PASSWORD`). Utilise des mots de passe longs et différents.

## Installation, étape par étape (sur ordinateur)

**1. GitHub**
- Crée un nouveau dépôt (par exemple `fasowatch`). Choisis « Private » si tu veux le garder privé.
- Dézippe ce dossier, puis dépose tous les fichiers dans le dépôt, y compris le dossier caché `.github`.
- Ne dépose jamais ton lien Neon ni tes mots de passe dans les fichiers.

**2. Vercel**
- Clique sur « Add New », puis « Project », et choisis ton dépôt `fasowatch`.
- « Framework Preset » : laisse « Other ». Ne change rien d’autre.
- Ouvre « Environment Variables » et ajoute ces 3 variables :
  - `DATABASE_URL` : le lien de connexion Neon
  - `CRON_SECRET` : ton premier mot de passe
  - `ADMIN_PASSWORD` : ton deuxième mot de passe
- Clique sur « Deploy ». Tu obtiens une adresse du type `https://fasowatch-xxxx.vercel.app`.

**3. Première mise à jour des actualités**
Le site est vide au début. Il faut lancer une première mise à jour :
- Dans GitHub, ouvre ton dépôt, puis « Settings », « Secrets and variables », « Actions ».
- Ajoute 2 secrets : `CRON_SECRET` (le même mot de passe que dans Vercel) et `SITE_URL` (l’adresse de ton site, sans `/` à la fin).
- Ouvre l’onglet « Actions », choisis « Actualiser FasoWatch », puis « Run workflow ».
- Après environ une minute, recharge ton site : les articles sont là.

Ensuite, GitHub relance la mise à jour toutes les 30 minutes environ. Vercel la lance aussi une fois par jour, comme filet de sécurité.

**4. Vérifier que tout marche**
- En bas du site, clique sur « État des sources ». Tu vois quelles sources marchent et lesquelles sont en panne, avec la raison.
- Une source en panne n’est pas grave : le reste fonctionne. Pour la corriger, change son adresse dans `lib/sources.js`, ou supprime sa ligne.

## Ajouter un lien TikTok ou Facebook à vérifier

Ouvre `https://ton-site.vercel.app/admin.html`, entre ton `ADMIN_PASSWORD`, puis ajoute le lien, un titre et une note. Il apparaît dans l’onglet « À vérifier », séparé des sources fiables.

## Ajouter ou retirer une source

Ouvre `lib/sources.js`. Chaque source est une ligne. Il y a deux façons de l’écrire :

- **Avec l’adresse de la page** (le plus simple) : le site trouve tout seul le flux RSS. Exemple pour un ministère :
  `{ id: 'min-sante', name: 'Ministère de la Santé', site: 'https://adresse-du-ministere.gov.bf', regions: ['burkina'] },`
- **Avec l’adresse exacte du flux RSS** : écris `url:` à la place de `site:`.

**Une chaîne YouTube** : mets le lien de la chaîne et la zone `['videos']`. Exemple :
`{ id: 'yt-exemple', name: 'Nom de la chaîne (YouTube)', site: 'https://www.youtube.com/@NomDeLaChaine', regions: ['videos'] },`

Pour retirer une source, supprime sa ligne. Ensuite, enregistre dans GitHub : Vercel republie le site tout seul. Si un site n’a aucun flux RSS (cas de plusieurs ministères), « État des sources » affichera « Aucun flux RSS trouvé ». On ne peut alors pas le lire automatiquement.

## Les onglets

- **Ministères** : tout ce qui vient du gouvernement burkinabè (SIG, Présidence, Journal officiel, sites des ministères des Finances, de la Santé, de l’Agriculture, du Commerce et des Mines). Le site y met aussi les articles du Burkina qui parlent d’un ministère ou d’un ministre. Le ministère de la Communication n’a pas encore de site connu : ses communiqués arrivent par le SIG et la presse. Si tu trouves son adresse officielle, ajoute une ligne avec `site:` dans `lib/sources.js`.
- **AES** : tout ce qui parle de la Confédération des États du Sahel (Burkina, Mali, Niger). Le site la repère aussi dans le texte des articles des autres sources.
- **Vidéos** : les chaînes YouTube. Ce sont des opinions de créateurs, pas des informations vérifiées. Pour le trading et la crypto, méfie-toi des promesses de gains faciles.
- **À vérifier** : les liens TikTok ou Facebook que tu ajoutes toi-même.

## Bon à savoir

- Le site garde 60 jours d’articles, pour rester léger sur la base gratuite.
- Il affiche le titre, un court résumé, la source et le lien vers l’article original. Il ne copie pas les articles en entier.
- Les thèmes sont devinés avec des mots-clés (liste dans `lib/classify.js`). Ce n’est pas parfait. Un article sans thème va dans « Autres ».
- Si le dépôt est public et reste sans aucune activité pendant 60 jours, GitHub peut mettre en pause les mises à jour automatiques. Dans ce cas, relance-les depuis l’onglet « Actions ».
- Tester le code sur ordinateur : `npm install`, puis `npm test`.
