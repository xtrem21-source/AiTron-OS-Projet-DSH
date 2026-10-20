# AiTron OS — DSH × AionUI

**Un poste de travail d’agents local, en français, avec le moteur DeepSeek Harness et les surfaces d’AionUI.**

[English](README.en.md) · [Journal de fusion](JOURNAL-FUSION.md) · [Notice](NOTICE-AIONUI.md)

---

## Ce que c’est

Ce dépôt réunit deux projets en un seul produit exécutable :

| Brique | Origine | Rôle |
|---|---|---|
| **Moteur** | [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (Cordis, TypeScript) | sessions durables, outils, compaction, fournisseurs de modèles, interface web |
| **Surfaces** | [AionUI](https://github.com/iOfficeAI/AionUi) (idées, catalogue d’assistants) | catalogue de 21 assistants professionnels, tableau des tâches parallèles, panneau d’aperçu |

La greffe ne copie pas l’interface Electron d’AionUI : elle **réimplémente ses trois surfaces** sur les points d’extension natifs de DSH (slots, onglets de barre latérale, sessions), pour rester maintenable et compatible avec les mises à jour du moteur.

## Ce qui a été ajouté

| Paquet | Ce qu’il apporte |
|---|---|
| `packages/client/ui-aionui` | page **AionUi** : catalogue des 21 assistants, tableau des tâches parallèles, onglet **Aperçu** (images, PDF, HTML isolé, CSV, diffs) |
| `packages/client/locale-fr` | **français** : `fr` + dictionnaires `common`, `conversation`, `settings*`, `sidebar`, `sidebarRight`, `workspace`, `trajectory`, `deliverables`, `subagent`, `pluginManager`, `schedule.manager`, `aionui` |
| `packages/client/ui-voice-input` | **dictée** dans la zone de saisie : reconnaisseur du navigateur, une énonciation par session, arrêt au silence, à la frappe, à l’envoi ou au second clic |
| `packages/context/aionui-linear` | **protocole linéaire** pour le cache de préfixe : section système statique en queue + audit des injections de tête |

Les assistants viennent du catalogue public d’[AionCore](https://github.com/iOfficeAI/AionCore) (Apache-2.0) ; voir [NOTICE-AIONUI.md](NOTICE-AIONUI.md).

## Démarrage rapide

Prérequis : **Node.js** `^22.19 || >=24`, **pnpm** `11.28.5`.

```sh
pnpm install
pnpm run build
pnpm dsh web
```

Le serveur écoute par défaut sur `http://127.0.0.1:3080` et ouvre le navigateur avec un jeton de lancement. Pour ne pas l’ouvrir : `pnpm dsh web --no-open`.

## Choisir un modèle

- **DeepSeek** : clé `DEEPSEEK_API_KEY` (Réglages → Modèles, ou `~/.dsh/.credentials.yaml`).
- **Autres fournisseurs** (NVIDIA, OpenAI-compatible, passerelles) via le routeur `llm-pi-ai` :

```yaml
# ~/.dsh/profiles/web/cordis.patch.yml
- id: llm-pi-ai
  name: "@deepseek-ai/dsh-llm-pi-ai"
  config:
    providers:
      nvidia:
        apiKeyEnv: NVIDIA_API_KEY
- id: agent-default-model
  config:
    provider: nvidia
    model: nvidia/nemotron-3-ultra-550b-a55b
```

## Langue

**Réglages → Général → Langue → Français.** Le choix s’applique immédiatement et se mémorise par navigateur. Les clés non traduites retombent en anglais, une par une.

## Dictée

Le bouton micro se trouve à droite, dans la zone de saisie. Il utilise le reconnaisseur du navigateur (`SpeechRecognition`), dans la langue de l’interface.

| Comportement | Détail |
|---|---|
| Une énonciation | le micro se coupe seul à la première pause |
| Texte préservé | le brouillon existant est conservé, la transcription s’ajoute |
| Priorité au clavier | toute frappe ou tout clic hors du bouton coupe le micro |
| Envoi | coupe immédiatement le micro |
| Second clic | coupe et relâche le micro |

Limites : navigateurs Chromium uniquement ; l’audio est traité par le service du navigateur, pas en local ; dicter par-dessus des puces de fichiers les remplace.

## Vérifications

```sh
pnpm run typecheck      # 5 gates
pnpm run build          # 9 gates
pnpm run build:check    # 2 gates
pnpm exec tsx scripts/run-oxlint.ts packages/client/locale-fr packages/client/ui-voice-input packages/client/ui-aionui
```

## Structure des changements

```
packages/client/ui-aionui/        page AionUi + aperçu
packages/client/locale-fr/        pack de langue française
packages/client/ui-voice-input/   dictée
packages/context/aionui-linear/   protocole linéaire / cache
packages/bundle/web-app/          roster et montage des plugins
JOURNAL-FUSION.md                 trace datée de toutes les séances
```

## Licence

MIT, comme le dépôt amont. Le catalogue d’assistants repris d’AionCore est sous Apache-2.0 : voir [NOTICE-AIONUI.md](NOTICE-AIONUI.md).

## État

Aperçu développeur : les surfaces AionUI sont expérimentales, la couverture française est large mais non exhaustive, et aucun chiffre de cache n’est publié tant qu’il n’a pas été mesuré sur une clé réelle.