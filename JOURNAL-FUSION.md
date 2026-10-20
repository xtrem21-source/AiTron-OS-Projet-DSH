# Journal de fusion — DSH + AionUI

> **Ce que c'est** — la trace datée de tout ce qui a été fait sur `K:\AiTron-OS-Projet-DSH` : objectif, raisonnement, approche, étapes, évolutions, tests, anomalies.
> **Règle** — on **ajoute** une entrée datée à la fin. On ne réécrit jamais une entrée précédente ; une erreur se corrige par une entrée plus récente qui la nomme.
> **Portée** — l'état du dépôt à la date de l'entrée : commit de base `687f282` (deepseek-harness `master`, 2026-10-17).
> **Hors dépôt** — logs de build, scripts jetables et caches : `K:\Reasonix-Temp-2\`.

---

## Entrée 2026-10-20 — Séance 1 : fusion initiale (moteur DSH + shell AionUi)

### Objectif

Fusionner le moteur **DeepSeek Harness** (`deepseek-ai/deepseek-harness`, TypeScript, monorepo pnpm, architecture Cordis) avec les fonctions clés d'**AionUi** (`iOfficeAI/AionUi`) : gestionnaire multi-tâches, panneau d'aperçu des fichiers générés, catalogue de 21 assistants professionnels, et un protocole d'historique linéaire compatible avec le cache KV de DeepSeek. Contrainte : tout le travail, caches compris, hors du disque `C:`.

### Contexte et hypothèses de départ

| Point | Constat | Traitement |
|---|---|---|
| URL du dépôt moteur | le mandat donnait `https://github.com` (tronqué) | recherche GitHub : `deepseek-ai/deepseek-harness`, description « Everything is a Plugin », branche `master` |
| Dépôt interface | `K:\AiTron-OS-Projet\AionUi` déjà cloné (2.2.2), cœur Rust `aionrs` et `AionCore` clonés à côté | réutilisé en lecture seule ; rien n'a été modifié dedans |
| Nature d'AionUi | Electron + Arco + cœur natif Rust `aioncore` (le prompt vit dans le binaire) | pas de copie de composants : réimplémentation des surfaces sur les coutures DSH |
| Disque `C:` | 3,0 Go libres seulement | store pnpm, cache pnpm, TEMP/TMP, caches Electron/node-gyp/Playwright/corepack sur `K:` |
| Clé API | absente | aucune session modèle réelle n'a été exécutée |

### Approche retenue

1. **Lire la loi avant d'agir** : charte Reasonix, index mémoire, `AGENTS.md` du dépôt, `docs/architecture.md`, règles des paquets clients.
2. **Cartographier les coutures** avant d'écrire : `main` (panneau keyed), `sidebar.panellist`, `sidebarRightTabs` + `sidebar.right.pane.tab`, `uiWorkspace.startSession/openSession`, `useSessions/useSessionStatus`, Remote `workspaceFiles`, presets d'agent.
3. **Greffer par extension, pas par fork** : deux paquets neufs (un hôte, un client), câblés dans le bundle `web-app`.

### Étapes, dans l'ordre

| # | Étape | Commande / vérification | Résultat |
|---|---|---|---|
| 1 | Clone du moteur | `git clone https://github.com/deepseek-ai/deepseek-harness.git` | `HEAD 687f282`, `git status` vide, `git fsck` exit 0, 16 325 fichiers |
| 2 | Isolation des caches | `.npmrc` (`store-dir`, `cache-dir`) + `storeDir`/`cacheDir` dans `pnpm-workspace.yaml` + `K:\Reasonix-Temp-2\dsh-env.ps1` | `pnpm store path` = `K:/Reasonix-Temp-2/pnpm-store\v11` ; `cache-dir` idem |
| 3 | Build de référence | `pnpm install --frozen-lockfile` puis `pnpm run build` | install 4 min 38 s ; 9/9 gates ; `build:check` 2/2 |
| 4 | Cartographie | lectures ciblées des paquets modèles (`ui-sidebar-files`, `ui-jobs`, `ui-plugin-manager`, `navigation.ts`, `workspace-files`) | recette de greffe établie, aucune écriture |
| 5 | Paquet hôte `packages/context/aionui-linear` | `systemPrompt.section` statique en queue + audit `agent/pre-step` | testé 9/9, lint 0 |
| 6 | Paquet client `packages/client/ui-aionui` | page `main` + entrée `sidebar.panellist` + type d'onglet `aionui-preview` | catalogue 21 assistants, tableau des tâches, aperçu fichiers |
| 7 | Câblage | `tsconfig.client.json`, `tsconfig.host.json`, alias `tsconfig.base.json`, `web-app/package.json`, roster `cordis.patch.yml` | `pnpm dsh --profile web --dump-config` liste les deux lignes |
| 8 | Recette | `pnpm run build`, `pnpm run build:check`, `pnpm dsh web --no-open` | 9/9, 2/2, HTTP 200, `__DSH_BOOT__` contient `ui-aionui` |

### Décisions techniques (et leur raison)

| Décision | Raison |
|---|---|
| pnpm 11 lit `pnpm-workspace.yaml`, pas `.npmrc` | vérifié : `pnpm config get store-dir` restait `undefined` avec `.npmrc` seul ; `.npmrc` conservé comme demandé mais inerte pour pnpm |
| Pas de copie de l'UI AionUi | son UI est Electron/Arco et son prompt vit dans un binaire Rust absent ; une copie aurait produit un patch mort |
| Arrêter = arrêt **et** archivage | seule voie typée exposée (`archiveSession(id, { stopActivity: true })`), réversible par désarchivage |
| Aperçu limité à la racine du workspace | l'exploration récursive appartient déjà à l'onglet « fichiers » de DSH |
| HTML rendu en iframe `sandbox=""` | rendu réel sans script ni accès same-origin |
| Un seul ensemble de « vrais » assistants | données reprises du catalogue Apache-2.0 d'AionCore, directive condensée par assistant, envoyée comme premier message utilisateur (préfixe stable) |

### Tests fonctionnels de cette séance

- Catalogue : 21 cartes rendues, bouton « Start » de chaque carte, onglet « Tasks » listant la session avec état « Idle » et actions.
- Aperçu : onglet ouvert depuis le guide, liste des fichiers, état vide correct.
- Protocole linéaire : 9 tests unitaires (tête consolidée acceptée, injection après historique détectée, texte du protocole sans interpolation/heure/chemin).
- Serveur : démarrage sur le port par défaut 3080, page 200, graphe de boot contenant les deux paquets.

### Anomalies ouvertes à la fin de cette séance

1. `verify-cordis-config` échoue sur `apps/cli/tests/profiles/acp/cordis.yml` — fichier non modifié, défaut préexistant.
2. Aucune clé DeepSeek : zéro tour de modèle, donc aucun taux de cache mesuré.
3. Skills AionCore (officecli, morph-ppt, …) non installés : les assistants donnent la consigne, pas encore les outils.
4. Aperçu racine seulement ; arrêt = archivage ; pas de registre de décisions dans le dépôt.

---

## Entrée 2026-10-20 — Séance 2 : français + dictée dans la fenêtre de chat

### Objectif

1. Intégrer le **français** comme langue de l'interface.
2. Ajouter la **fonction micro** dans la fenêtre de chat.

### Raisonnement

**Français.** Le runtime de locale de DSH est fait pour ça : `ctx.locale.addLanguage({ id, label, fallback })` + `ctx.locale.register(namespace, langue, dictionnaire)`. Un paquet de langue externe est donc la voie prévue, sans forker les dictionnaires des 60 paquets clients. La recherche de clé suit la chaîne de repli **clé par clé** : un dictionnaire partiel est légal, une clé absente s'affiche en anglais au lieu de montrer sa clé.

**Micro.** Deux voies possibles, une seule tient :

| Voie | Ce qu'elle donne | Verdict |
|---|---|---|
| Bundle expérimental livré (`packages/experimental/voice-input-bundle`, SenseVoice local) | transcription locale, UI de préparation, choix du périphérique | **écarté** : SenseVoice n'accepte que `auto, zh, en, yue, ja, ko` — **pas de français** |
| Web Speech API du navigateur (`SpeechRecognition`, `fr-FR`) | dictée française correcte, zéro téléchargement | **retenu** ; limite : Chromium seulement, audio traité par le service du navigateur |

L'insertion passe par la seule face autorisée côté composer : `inputActions.setDraft(tête + transcription)`, avec la tête capturée au démarrage pour qu'une hypothèse intermédiaire ne s'accumule pas.

### Ce qui a été créé

| Paquet | Rôle | Fichiers clés |
|---|---|---|
| `packages/client/locale-fr` | enregistre `fr` (repli `en`) et traduit `common` (46 clés), `conversation` (≈80 clés visibles), `aionui` (40), `voiceInput` (5) | `src/client/index.ts`, `src/client/dictionaries.ts` |
| `packages/client/ui-voice-input` | bouton micro dans `conversation.input.right`, reconnaisseur du navigateur, langue = langue de l'interface | `src/client/speech.ts`, `dictation.ts`, `VoiceButton.tsx`, `locales.ts` |

Câblage identique à la séance 1 : `tsconfig.client.json`, alias `tsconfig.base.json`, dépendances `web-app/package.json`, deux lignes dans le roster `cordis.patch.yml` (`locale-fr`, `ui-voice-input`).

### Erreurs rencontrées et corrections

| Erreur | Cause | Correction |
|---|---|---|
| `TS6306` : projet référencé sans `composite` | référence vers `../ui-conversation` (face hôte) | référencer `../ui-conversation/tsconfig.client.json` |
| `TS2339` : `slots` absent de `Context` | l'augmentation vient de `ui-renderer/client` | import de type + référence + dépendance dev |
| `TS2559` : `typeof globalThis` sans propriétés communes | type « faible » (tout optionnel) | assertion `globalThis as Partial<SpeechScope>` |
| `TS2532` : objet possiblement `undefined` | index de résultat | garde sur `event.results[index]?.[0]` |
| lint `eol-last` (8 fichiers) + ternaire en instruction | fin de ligne manquante ; expression non utilisée | normalisation à un saut de ligne final ; `if/else` |

### Vérifications de cette séance

| Commande | Résultat |
|---|---|
| `pnpm run typecheck` | 5 gates, 0 échec (après les 5 corrections ci-dessus) |
| `pnpm run build` | 9 gates, 0 échec, **331 artefacts client** (327 avant) |
| `run-oxlint.ts` sur les deux paquets | 0 avertissement, 0 erreur |
| Navigateur, Réglages → Général → Langue | « Français » listé ; bascule immédiate |
| Après bascule | « Vers l'inconnu », « Aperçu », « Dicter », « Envoyer le message », « Fichiers », « Actualiser », « 21 assistants professionnels », « Démarrer », « Tâches » |
| Bouton micro | présent entre l'accès et le modèle ; clic → `Dictée interrompue : not-allowed` (permission micro refusée par le navigateur de test) : la chaîne bouton → reconnaisseur → message localisé fonctionne |

### Anomalies ouvertes à la fin de cette séance

1. **Couverture partielle** : `settings`, `trajectory`, `deliverables`, `subagent`, `job` restent en anglais ; la conversation est traduite pour le composer et la coquille de chat seulement. Aucune règle de pluriel (`fr`) n'est appliquée — chaque chaîne a une forme unique.
2. **Descriptions des 21 assistants en anglais** : ce sont des données de catalogue, pas de la copie d'interface ; traduire demanderait 21 descriptions de plus.
3. **Dictée non testée avec un vrai microphone** : seul le chemin d'erreur a été vérifié ; Chromium requis ; l'audio part chez le fournisseur du navigateur.
4. **`setDraft` remplace tout le brouillon** : dicter par-dessus un brouillon contenant des puces de fichiers/sessions les retire.
5. **SenseVoice non activé** : le bundle expérimental reste désactivé ; il ne conviendrait pas au français de toute façon.
6. Anomalies de la séance 1 toujours ouvertes (clé API absente, `verify-cordis-config`, skills AionCore).

---

## Entrée 2026-10-20 — Séance 3 : français intégral, micro discipliné, publication GitHub

### Objectif

1. **Éliminer le franglais** : l’interface doit être intégralement française quand « Français » est sélectionné.
2. **Réarchitecturer le micro** : arrêt au silence, priorité au clavier, extinction à l’envoi, texte existant préservé.
3. **Préparer et publier** le travail sur `https://github.com/xtrem21-source/AiTron-OS-Projet-DSH`, avec une présentation en français et en anglais.

### Raisonnement

**Français.** Le runtime de locale accepte des dictionnaires **partiels** : la recherche de clé suit la chaîne de repli (`fr → en`) clé par clé. On peut donc couvrir les namespaces visibles sans attendre une traduction exhaustive de 60 paquets. Le point délicat était le **catalogue des 21 assistants** : ses libellés viennent d’une donnée statique (AionCore), pas d’un dictionnaire. Solution : une table française statique (`assistant-fr.ts`) appliquée au rendu, pilotée par un hook de locale exposé par la face d’injection (`hooks: { locale }` → `useLocale`). Aucune requête, aucune latence, et le changement de langue rafraîchit les cartes sans remontage.

**Micro.** Le bundle expérimental livré (SenseVoice local) ne reconnaît que `auto, zh, en, yue, ja, ko` : **pas de français**. On garde donc le reconnaisseur du navigateur, mais avec une discipline d’arrêt :

| Scénario | Mécanisme |
|---|---|
| Silence | `recognition.continuous = false` : le reconnaisseur se coupe à la première pause |
| Frappe clavier | `keydown` au niveau document (modificateurs seuls ignorés) |
| Clic hors du bouton | `pointerdown` au niveau document, bouton exclu |
| Envoi | la phase d’entrée quitte `plain` (bouton Envoyer ou Entrée) |
| Second clic | le bouton coupe la session |
| Focus | `mousedown` annulé : le curseur reste dans l’éditeur ; `blur()` après arrêt |

Concaténation : le brouillon est capturé au démarrage (`initialDraft`) ; chaque fragment écrit `initialDraft + ' ' + transcription`. Le brouillon existant n’est jamais écrasé par une capture vide.

### Étapes

| # | Étape | Vérification |
|---|---|---|
| 1 | `dictionaries-shell.ts` : `settings`, `trajectory`, `deliverables`, `subagent` complets | 43 + 192 + 63 + 42 clés |
| 2 | Chrome : `sidebar`, `sidebarRight`, `workspace`, `settings.locale`, `settings.theme`, `settings.plugins`, `settings.agentPreset`, `settings.models`, `pluginManager`, `schedule.manager` | 5 + 34 + 119 + 22 + 5 + 4 + 4 + 2 |
| 3 | `assistant-fr.ts` + hook `useLocale` dans `ui-aionui` | 21 noms + 21 descriptions |
| 4 | `ui-voice-input` : `continuous=false`, concaténation, arrêts multiples | test unitaire 4/4 |
| 5 | `README.fr.md`, `README.en.md`, bandeau dans `README.md` | publication bilingue |
| 6 | `NOTICE-AIONUI.md`, `GITHUB-PUBLICATION.md` | attribution + procédure |

### Erreurs rencontrées et corrections

| Erreur | Cause | Correction |
|---|---|---|
| `TS6306` (composite) | référence vers la face hôte de `ui-conversation` | référencer `tsconfig.client.json` |
| `TS2339 ctx.slots` | augmentation fournie par `ui-renderer/client` | import de type + référence |
| `TS2559` `globalThis` | type faible, aucune propriété commune | assertion vers `Partial<SpeechScope>` |
| `TS2532` | index de résultat possiblement absent | garde sur `results[i]?.[0]` |
| `TS18048/TS2532/TS2412` (test) | instances et options non définies | helper `first()` + `| undefined` explicite |
| `as unknown` interdit par la règle du dépôt | fabrique de faux reconnaisseur | classe `FakeRecognition` statique, sans cast |
| lint `eol-last` | fins de ligne manquantes | normalisation |

### Tests de la séance

- `pnpm run typecheck` : 5 gates, 0 échec.
- `pnpm run build` : 9 gates, 0 échec, 331 artefacts client.
- `oxlint` sur les trois paquets : 0 avertissement, 0 erreur.
- `vitest` dictée : 4/4 (langue, `continuous=false`, arrêt, erreur, absence de reconnaisseur).
- Navigateur, langue française : « Vers l’inconnu », « Aperçu », « Dicter », « Envoyer le message », « Fichiers », « Actualiser », « 21 assistants professionnels », noms et descriptions des cartes en français, panneaux « Extensions » / « Tâches automatisées ».
- Micro : clic → erreur localisée `Dictée interrompue : not-allowed` dans le navigateur de test (permission refusée).

### Publication

Dépôt distant vérifié : `xtrem21-source/AiTron-OS-Projet-DSH`, public, **vide**, branche par défaut `main`. La procédure et les réglages recommandés sont dans `GITHUB-PUBLICATION.md`. Aucun secret n’est versionné : les clés restent dans `~/.dsh/.credentials.yaml`.

### Anomalies ouvertes à la fin de cette séance

1. **Couverture française non exhaustive** : les détails profonds de `conversation` (outils, trajectoire fine), `chat`, `commands`, `goal`, `plan`, `question`, `feedback`, `open-in-app`, `schedule.catalog`, `skill`, `reference` restent en anglais et retombent proprement.
2. **Micro non testé au micro réel** : seul le chemin d’erreur et la machine d’état (test unitaire) sont prouvés ; Chromium requis.
3. **`setDraft` remplace les puces** : dicter par-dessus des références de fichiers/sessions les retire.
4. **Pas de mesure de cache** : aucune clé DeepSeek utilisée pour un relevé `cacheReadTokens` ; la clé NVIDIA ne rapporte pas de cache de préfixe.
5. **Publication dépendante des identifiants Git** de la machine ; le dépôt distant est vide et la branche doit être `main`.
### Complément 2026-10-20 — extension de la couverture française

Après la première passe, la couverture a été étendue aux namespaces visibles restants : `sidebar` (5 clés), `sidebarRight` (34), `workspace` (119), `settings.locale`, `settings.permission` (12), `settings.sessionLog` (4), `settings.theme` (22), `settings.plugins` (5), `settings.agentPreset`, `settings.models`, `pluginManager`, `schedule.manager`, `shortcuts`, et `chat` (≈4 000 caractères de copie : réglages, consommation, reprises, étapes, compactage, images).

Vérifications : `typecheck` 5/5, `build` 9/9, `oxlint` 0 erreur, serveur relancé et Réglages affichés en français (« Permission », « Langue », « Apparence », « Taille de police », « Détail du travail », « Raccourcis clavier », « Performance et consommation », « Envoyer le journal de session… »).

Restent en anglais, assumé et documenté : le menu du compte (« Settings », « Feedback », « Sign in »), la phrase d’aide sous « Raccourcis clavier », les libellés du sélecteur de modèle, le mode d’accès (« Workspace Write »), et les détails profonds de la trajectoire/conversation.
### Validation 2026-10-20 — microphone réel (clôture de l’anomalie A1)

L’utilisateur confirme que la dictée fonctionne avec un vrai microphone, dans le navigateur, sur la version publiée (`ba9f58f`).

- **Chemin nominal vérifié** : le reconnaisseur démarre, transcrit et s’arrête seul à la pause.
- **Anomalie A1 close** : la séance 3 ne prouvait que le chemin d’erreur (`not-allowed`) et la machine d’état par test unitaire ; le micro réel est désormais confirmé.
- **Reste non mesuré** : précision de transcription par langue, comportement en environnement bruyant, et respect du silence sur un long énoncé.

État du produit à cette date : interface française, catalogue des 21 assistants en français, dictée fonctionnelle, protocole linéaire monté, publication sur `xtrem21-source/AiTron-OS-Projet-DSH` (branche `main`).
---

## Entrée 2026-10-20 — Séance 4 : finitions, version 0.1.0, publication enrichie

### Objectif

Terminer la couverture française visible, produire une **version complète** et mettre GitHub à niveau : tags, release, description, topics.

### Ce qui a été fait

| # | Action | Résultat |
|---|---|---|
| 1 | Derniers namespaces visibles : `settings.account`, `model`, `permission.access`, `shortcuts` (complété) | menu de compte, sélecteur de modèle, pastille de mode d’accès et phrase d’aide des raccourcis en français |
| 2 | `RELEASE-v0.1.0.md` | notes de version bilingues |
| 3 | Vérifications | `typecheck` 5/5, `build` 9/9, `build:check` 2/2, `oxlint` 0 erreur |
| 4 | Git | commit, tag annoté `v0.1.0` + tag daté `fige-2026-10-20`, push |
| 5 | GitHub | description, topics, release `v0.1.0` |

### Convention de tags retenue

Constatée sur les dépôts voisins (`Regles-Reasonix` : `v0.1.0` + tags datés `fige-AAAA-MM-JJ`) et en amont (`dsh-v0.2.1-rc.2`). Le fork suit la convention locale : **`v0.1.0`** pour la version, **`fige-2026-10-20`** pour la photo datée.

### Anomalies

- La publication de la release et des métadonnées dépend du jeton stocké dans le gestionnaire d’identifiants Git de la machine ; sans lui, la release reste à créer à la main.
- Couverture française toujours non exhaustive sur les détails profonds.
---

## Entrée 2026-10-20 — Séance 5 : conformité open-source et automatisations GitHub

### Objectif

Répondre aux manques signalés par l’audit externe (notation « F ») : fichiers institutionnels, Dependabot, CI sur les pull requests — et mettre le dépôt GitHub au niveau d’une publication publique.

### Constat avant action

| Élément | État réel |
|---|---|
| `CONTRIBUTING.md` | **présent** (amont) — non détecté par l’audit |
| `.github/dependabot.yml` | **présent** (amont : npm, uv, github-actions, cooldown 30 j) |
| `.github/workflows/ci.yml` | **présent** mais cible des runners d’entreprise et des variables absentes du fork |
| `SECURITY.md` | **absent** |
| `CODE_OF_CONDUCT.md` | **absent** |
| Workflows actifs | 25 workflows amont, dont `e2e.yml` qui échoue sur un push sans `DEEPSEEK_API_KEY` |

### Ce qui a été fait

| # | Action | Résultat |
|---|---|---|
| 1 | `SECURITY.md` bilingue | versions suivies, signalement privé via GitHub Security Advisories, périmètre, engagements, secrets |
| 2 | `CODE_OF_CONDUCT.md` | Contributor Covenant 2.1, FR + EN |
| 3 | `CONTRIBUTING.md` | section de fork en tête (paquets concernés, commandes à lancer, règle Cordis), texte amont conservé |
| 4 | `.github/workflows/fork-ci.yml` | `install --frozen-lockfile`, `typecheck`, `build`, `build:check` sur push `main`, PR et manuel ; Node 24, pnpm 11.28.5, cache pnpm |
| 5 | `README.md` | devient la vitrine du projet (badges licence/version/langues/CI, démarrage, modèle, vérifications, structure) ; texte amont déplacé dans `README-UPSTREAM.md` |
| 6 | Workflows amont | **désactivés** via l’API (25 workflows) sauf `Fork CI` : plus de statut rouge dû à des runners ou secrets absents |
| 7 | Métadonnées GitHub | description posée, topics `ai-agents, aionui, cordis, deepseek-harness, french, plugin-architecture, typescript, voice-input`, signalement privé de vulnérabilités **activé** |
| 8 | Release | `v0.1.0` publiée avec les notes bilingues de `RELEASE-v0.1.0.md` |

### Preuves

- `Fork CI` sur GitHub : **run 39414284114, conclusion `success`**, commit `7cc1b24d`.
- `GET /releases` : `v0.1.0` publié (`2026-10-20T11:19:17Z`).
- `GET /private-vulnerability-reporting` : `enabled=True`.
- Topics et description relus via l’API après écriture.
- Tags : `v0.1.0`, `fige-2026-10-20` + jeu amont `dsh-v*` poussé.

### Anomalies

- L’audit externe note un référentiel « grand public » : la note ne mesure pas la qualité du code, seulement la présence de fichiers attendus. Les fichiers manquants sont désormais là ; `CONTRIBUTING` et Dependabot existaient déjà.
- La CI amont reste dans le dépôt mais désactivée : la réactiver supposerait ses runners et ses secrets.
- Un workflow amont (`e2e.yml`) a produit un échec avant d’être désactivé ; l’historique le conserve.
---

## Entrée 2026-10-20 — Séance 6 : lancement Windows

### Objectif

Rendre le produit lançable sans ligne de commande depuis Windows.

### Ce qui a été fait

| # | Action | Résultat |
|---|---|---|
| 1 | `Lancer-AiTron.cmd` | double-clic : vérifie Node/pnpm, déporte TEMP/TMP sur `K:`, installe au premier lancement, compile si nécessaire, démarre `dsh web` et ouvre le navigateur |
| 2 | Messages d’erreur explicites | Node manquant → lien nodejs.org ; pnpm manquant → `npm install -g pnpm@11.28.5` ; disque `K:` absent → message dédié |
| 3 | Documentation | section « Lancer sous Windows » dans `README.md` et « Launching on Windows » dans `README.en.md`, avec la variante PowerShell et les commandes `winget`/`npm` |

### Test du lanceur

Exécution réelle de `Lancer-AiTron.cmd` avec l’entrée standard fermée (`< nul`) :

```
[1/3] Dependances deja installees.
[2/3] Build deja present.
[3/3] Demarrage du serveur sur http://127.0.0.1:3080
dsh web: http://127.0.0.1:3080/?token=…
```

Le serveur répond et le navigateur s’ouvre : le chemin nominal du lanceur est vérifié, y compris le cas « dépendances et build déjà présents ».

### Anomalies

- Le premier lancement sur une machine neuve exécute `pnpm install` puis `pnpm run build` : plusieurs minutes, sans barre de progression globale.
- Le lanceur suppose le disque `K:` présent ; hors de cette machine, il faut adapter `CACHE` et le chemin du dépôt.
### Complément 2026-10-20 — raccourci Bureau et lancement silencieux

| Élément | Détail |
|---|---|
| `AiTron OS.lnk` | créé sur le Bureau : cible `Lancer-AiTron.cmd`, dossier `K:\AiTron-OS-Projet-DSH`, icône `apps/desktop/resources/tray-windows.ico`, fenêtre réduite |
| `Lancer-AiTron-Silencieux.vbs` | démarre sans fenêtre via `Lancer-AiTron-Silencieux.cmd`, journalise dans `K:\Reasonix-Temp-2\logs\web.log`, sonde le port 3080 avant et après, propose d’arrêter une instance existante ; `/silencieux` supprime toute boîte de dialogue |
| `Arreter-AiTron.cmd` | arrête l’arbre de processus qui écoute sur 3080 (`taskkill /T /F`) |

Tests réels : `Arreter-AiTron.cmd` → « Serveur arrete (PID 1040). » ; `cscript Lancer-AiTron-Silencieux.vbs /silencieux` → exit 0, port 3080 en écoute (PID 3664), journal avec l’URL tokenisée.