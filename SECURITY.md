# Sécurité / Security

[Français](#français) · [English](#english)

## Français

### Versions suivies

| Version | Support |
|---|---|
| 0.1.x | correctifs de sécurité |
| < 0.1 | non suivi |

### Signaler une vulnérabilité

**N’ouvrez pas d’issue publique.** Utilisez l’onglet **Security → Report a vulnerability**
(GitHub Security Advisories) de ce dépôt :

<https://github.com/xtrem21-source/AiTron-OS-Projet-DSH/security/advisories/new>

Si l’onglet est indisponible, écrivez à l’adresse du compte propriétaire du dépôt en
précisant « SECURITY » en objet.

### Ce qu’un rapport doit contenir

- version et commit (`git rev-parse HEAD`) ;
- système et navigateur ;
- chemins affectés, et si possible une reproduction minimale ;
- impact estimé (fuite de données, exécution de code, déni de service).

### Périmètre

Sont concernés : le code de ce dépôt (`packages/`, `apps/`), les plugins livrés,
et la configuration par défaut du profil `web`.

Ne sont pas concernés : les vulnérabilités du moteur amont (à signaler à
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)), les
fournisseurs de modèles, ni les navigateurs.

### Engagements

- accusé de réception sous 7 jours ouvrés ;
- évaluation et plan de correction sous 30 jours ;
- crédit dans l’avis de sécurité, si vous le souhaitez.

### Secrets

Aucune clé n’est versionnée. Les clés vivent dans
`~/.dsh/.credentials.yaml` (stockage local) ou dans l’environnement. Si vous
pensez qu’un secret a été exposé, révoquez-le d’abord chez le fournisseur.

## English

### Supported versions

| Version | Support |
|---|---|
| 0.1.x | security fixes |
| < 0.1 | unsupported |

### Reporting a vulnerability

**Do not open a public issue.** Use **Security → Report a vulnerability**
(GitHub Security Advisories):

<https://github.com/xtrem21-source/AiTron-OS-Projet-DSH/security/advisories/new>

### What to include

Version and commit (`git rev-parse HEAD`), platform and browser, affected paths
with a minimal reproduction, and the estimated impact.

### Scope

In scope: this repository’s code (`packages/`, `apps/`), the shipped plugins, and
the default `web` profile configuration. Out of scope: upstream engine issues
(report to [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)),
model providers and browsers.

### Commitments

Acknowledgement within 7 business days, assessment and remediation plan within
30 days, and credit in the advisory if you want it.

### Secrets

No key is committed. Keys live in `~/.dsh/.credentials.yaml` or the environment.
If a secret leaked, revoke it at the provider first.