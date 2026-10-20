# Publication GitHub / GitHub publication

Dépôt cible : `https://github.com/xtrem21-source/AiTron-OS-Projet-DSH`
Target repository: `https://github.com/xtrem21-source/AiTron-OS-Projet-DSH`

---

## Français

### Ce que contient la publication

| Élément | État |
|---|---|
| Moteur DeepSeek Harness (`687f282`) | conservé tel quel |
| Surfaces AionUI (`ui-aionui`) | ajoutées |
| Pack de langue française (`locale-fr`) | ajouté |
| Dictée (`ui-voice-input`) | ajoutée |
| Protocole linéaire / cache (`aionui-linear`) | ajouté |
| `README.fr.md` / `README.en.md` | présentation bilingue |
| `JOURNAL-FUSION.md` | trace datée des séances |
| `NOTICE-AIONUI.md` | attribution Apache-2.0 |

### Avant de pousser

1. **Aucun secret ne doit partir.** Les clés vivent dans `~/.dsh/.credentials.yaml`,
   hors dépôt. Vérifier : `git grep -nE "nvapi-|sk-[A-Za-z0-9]{20,}"` ne doit rien renvoyer.
2. **Identité de commit** : `git config user.name` et `git config user.email`
   (réglés localement dans ce dépôt si absents).
3. **Licence** : MIT (fichier `LICENSE` du dépôt amont). L’attribution AionCore
   est dans `NOTICE-AIONUI.md`.

### Publier

```sh
git add -A
git commit -m "AiTron OS: AionUI surfaces, French UI, dictation, linear cache protocol"
git branch -M main
git remote add origin https://github.com/xtrem21-source/AiTron-OS-Projet-DSH.git
git push -u origin main
```

Le dépôt distant existe et est **vide** ; la branche par défaut est `main`.
L’authentification passe par le gestionnaire d’identifiants Git de Windows.

### Réglages recommandés sur GitHub

| Réglage | Valeur |
|---|---|
| Description | `AiTron OS — DeepSeek Harness + AionUI surfaces, interface française, dictée` |
| Topics | `deepseek-harness`, `cordis`, `aionui`, `agents`, `typescript`, `french` |
| Licence | MIT |
| Site | README affiché = `README.fr.md` (ou renommer selon la langue voulue) |

---

## English

### What the publication contains

The DeepSeek Harness engine at `687f282`, plus the AionUI surfaces
(`ui-aionui`), the French language pack (`locale-fr`), dictation
(`ui-voice-input`), and the linear cache protocol (`aionui-linear`).
Bilingual presentation in `README.fr.md` / `README.en.md`, dated work log in
`JOURNAL-FUSION.md`, attribution in `NOTICE-AIONUI.md`.

### Before pushing

1. **No secret leaves the machine.** Keys live in `~/.dsh/.credentials.yaml`;
   check with `git grep -nE "nvapi-|sk-[A-Za-z0-9]{20,}"`.
2. **Commit identity**: `git config user.name` / `user.email`.
3. **License**: MIT (upstream `LICENSE`), attribution in `NOTICE-AIONUI.md`.

### Publish

```sh
git add -A
git commit -m "AiTron OS: AionUI surfaces, French UI, dictation, linear cache protocol"
git branch -M main
git remote add origin https://github.com/xtrem21-source/AiTron-OS-Projet-DSH.git
git push -u origin main
```

The remote repository exists and is empty; its default branch is `main`.
Authentication uses the Windows Git credential manager.

### Recommended GitHub settings

Description `AiTron OS — DeepSeek Harness + AionUI surfaces, French UI,
dictation`; topics `deepseek-harness`, `cordis`, `aionui`, `agents`,
`typescript`, `french`; license MIT; the displayed README is your choice of
`README.fr.md` or `README.en.md`.