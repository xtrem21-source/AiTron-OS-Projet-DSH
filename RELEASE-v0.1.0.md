# AiTron OS 0.1.0 — première version complète

**Français** · [English](#english)

Première version publiable de la fusion **DeepSeek Harness × AionUI**.

## Ce qu’elle contient

| Brique | Détail |
|---|---|
| Moteur | DeepSeek Harness `687f282` (Cordis, TypeScript) |
| Page **AionUi** | catalogue des 21 assistants, tableau des tâches parallèles, onglet **Aperçu** (images, PDF, HTML isolé, CSV, diffs) |
| **Français** | `fr` + 18 dictionnaires : `common`, `conversation`, `chat`, `settings*`, `sidebar`, `sidebarRight`, `workspace`, `trajectory`, `deliverables`, `subagent`, `pluginManager`, `schedule.manager`, `model`, `permission.access`, `shortcuts`, `aionui`, `voiceInput` |
| **Dictée** | bouton dans la zone de saisie, une énonciation par session, arrêt au silence, à la frappe, à l’envoi ou au second clic, brouillon préservé |
| **Cache linéaire** | section système statique en queue + audit des injections de tête (`aionui-linear`) |

## Vérifications de la version

| Commande | Résultat |
|---|---|
| `pnpm run typecheck` | 5 gates, 0 échec |
| `pnpm run build` | 9 gates, 0 échec |
| `pnpm run build:check` | 2 gates, 0 échec |
| `oxlint` sur les nouveaux paquets | 0 erreur |
| `vitest` (protocole linéaire + dictée) | 13/13 |
| `pnpm dsh web --no-open` | démarre sur 3080, page 200 |
| Dictée réelle | validée par l’utilisateur sur matériel réel |

## Limites connues

- Couverture française large mais non exhaustive (menu de compte, détails profonds des outils restent en anglais et retombent proprement).
- Dictée : navigateurs Chromium uniquement ; audio traité par le service du navigateur.
- Aucun chiffre de cache de préfixe publié : la mesure exige une clé DeepSeek.
- Les surfaces AionUI sont expérimentales.

## Licence

MIT (dépôt amont). Catalogue d’assistants : Apache-2.0, voir `NOTICE-AIONUI.md`.

---

## English

First publishable version of the **DeepSeek Harness × AionUI** fusion.

**Included:** the DSH engine at `687f282`; the AionUi page (21-assistant catalog, parallel task board, preview tab); a French language pack across 18 namespaces; composer dictation with one utterance per session and four stop paths; and the linear prefix-cache protocol (`aionui-linear`).

**Verified:** typecheck 5/5, build 9/9, build:check 2/2, oxlint clean, 13 unit tests, `dsh web` serving on 3080, real-hardware dictation confirmed by the user.

**Known limits:** French coverage is broad but not exhaustive; dictation is Chromium-only and uses the browser’s speech service; no prefix-cache figure is published until it is measured with a DeepSeek key; the AionUI surfaces are experimental.

**License:** MIT (upstream), assistant catalog Apache-2.0 — see `NOTICE-AIONUI.md`.