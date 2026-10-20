# AiTron OS — DSH × AionUI

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.1.0-informational.svg)](RELEASE-v0.1.0.md)
[![Langues](https://img.shields.io/badge/langues-FR%20%7C%20EN-success.svg)](README.en.md)
[![Fork CI](https://github.com/xtrem21-source/AiTron-OS-Projet-DSH/actions/workflows/fork-ci.yml/badge.svg)](https://github.com/xtrem21-source/AiTron-OS-Projet-DSH/actions/workflows/fork-ci.yml)

**Un poste de travail d’agents local, en français, avec le moteur DeepSeek Harness et les surfaces d’AionUI.**

[English](README.en.md) · [Journal de fusion](JOURNAL-FUSION.md) · [Notes de version](RELEASE-v0.1.0.md) · [Sécurité](SECURITY.md)

---

## Ce que c’est

| Brique | Origine | Rôle |
|---|---|---|
| **Moteur** | [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (Cordis, TypeScript) | sessions durables, outils, compaction, fournisseurs de modèles, interface web |
| **Surfaces** | [AionUI](https://github.com/iOfficeAI/AionUi) (idées, catalogue d’assistants) | catalogue de 21 assistants, tableau des tâches parallèles, panneau d’aperçu |

La greffe **réimplémente** les trois surfaces d’AionUI sur les points d’extension natifs de DSH (slots, onglets de barre latérale, sessions) plutôt que de copier son interface Electron : le fork reste maintenable face aux mises à jour du moteur.

## Démarrage rapide

Prérequis : **Node.js** `^22.19 || >=24`, **pnpm** `11.28.5`.

```sh
pnpm install
pnpm run build
pnpm dsh web
```

Le serveur écoute sur `http://127.0.0.1:3080` et ouvre le navigateur avec un jeton de lancement (`--no-open` pour l’éviter).

## Lancer sous Windows

**Le plus simple : double-cliquer `Lancer-AiTron.cmd`** à la racine du dépôt.

| Étape | Ce que fait le lanceur |
|---|---|
| 1 | vérifie Node.js et pnpm, avec un message clair si l’un manque |
| 2 | déporte `TEMP`/`TMP` sur `K:\Reasonix-Temp-2` |
| 3 | installe les dépendances au premier lancement (`pnpm install --frozen-lockfile`) |
| 4 | compile au premier lancement (`pnpm run build`) |
| 5 | démarre `dsh web` sur `http://127.0.0.1:3080` et ouvre le navigateur |

Pour un raccourci : clic droit sur `Lancer-AiTron.cmd` → **Envoyer vers → Bureau (créer un raccourci)**.
Pour arrêter : fermer la fenêtre noire ou `Ctrl+C` dedans.

Variante manuelle, dans PowerShell :

```powershell
cd K:\AiTron-OS-Projet-DSH
pnpm install
pnpm run build
pnpm dsh web
```

Prérequis si les commandes manquent :

```powershell
winget install OpenJS.NodeJS.LTS     # Node.js 24
npm install -g pnpm@11.28.5          # pnpm
```
## Ce qui a été ajouté

| Paquet | Apport |
|---|---|
| `packages/client/ui-aionui` | page **AionUi** : 21 assistants, tâches parallèles, onglet **Aperçu** (images, PDF, HTML isolé, CSV, diffs) |
| `packages/client/locale-fr` | **français** : `fr` + 18 dictionnaires (chrome, réglages, conversation, trajectoire, livrables…) |
| `packages/client/ui-voice-input` | **dictée** dans la zone de saisie : une énonciation, arrêt au silence, à la frappe, à l’envoi, au second clic |
| `packages/context/aionui-linear` | **protocole linéaire** : section système statique en queue + audit des injections de tête |

Catalogue d’assistants : données d’[AionCore](https://github.com/iOfficeAI/AionCore) (Apache-2.0), voir [NOTICE-AIONUI.md](NOTICE-AIONUI.md).

## Modèle

- **DeepSeek** : `DEEPSEEK_API_KEY` (Réglages → Modèles, ou `~/.dsh/.credentials.yaml`).
- **Autres fournisseurs** (NVIDIA, passerelles OpenAI-compatibles) via `llm-pi-ai` :

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

## Vérifications

```sh
pnpm run typecheck      # 5 gates
pnpm run build          # 9 gates
pnpm run build:check    # 2 gates
pnpm test               # suite unitaire
```

La CI du fork (`.github/workflows/fork-ci.yml`) exécute `typecheck`, `build` et `build:check` à chaque push sur `main` et à chaque pull request.

## Contribuer

Lire [CONTRIBUTING.md](CONTRIBUTING.md) et [SECURITY.md](SECURITY.md). Les paquets suivent les règles Cordis du dépôt : une extension passe par un slot ou un service, jamais par une modification du cœur.

## Structure

```
packages/client/ui-aionui/        page AionUi + aperçu
packages/client/locale-fr/        pack de langue française
packages/client/ui-voice-input/   dictée
packages/context/aionui-linear/   protocole linéaire / cache
packages/bundle/web-app/          roster et montage des plugins
JOURNAL-FUSION.md                 trace datée des séances
```

## Documentation du moteur

L’architecture, les cookbooks et les références de paquets restent ceux du moteur : voir [`docs/`](docs/README.md) et [`README-UPSTREAM.md`](README-UPSTREAM.md).

## Licence

MIT, comme le dépôt amont. Le catalogue d’assistants repris d’AionCore est sous Apache-2.0 : voir [NOTICE-AIONUI.md](NOTICE-AIONUI.md).

## État

Aperçu développeur : les surfaces AionUI sont expérimentales, la couverture française est large mais pas exhaustive, et aucun chiffre de cache n’est publié tant qu’il n’a pas été mesuré sur une clé réelle.
