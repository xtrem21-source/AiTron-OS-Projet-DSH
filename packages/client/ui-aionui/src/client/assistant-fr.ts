/**
 * French copy for the 21 assistant cards.
 *
 * The catalog itself stays the English AionCore data; this module is a static
 * lookup applied while rendering, so switching the interface language switches
 * the cards without any request, reload or catalog copy on the Host.
 */
import type { AionuiAssistant } from './catalog.ts'

/** One localized card face. */
export interface AssistantCopy {
  /** Display name. */
  readonly name: string
  /** One-line capability summary. */
  readonly description: string
}

/** French names and descriptions, keyed by catalog id. */
export const ASSISTANT_FR: Readonly<Record<string, AssistantCopy>> = {
  'word-creator': {
    name: 'Créateur Word',
    description: 'Crée, modifie et analyse des documents Word professionnels avec officecli. Rapports, propositions, lettres, notes et plus encore.',
  },
  'ppt-creator': {
    name: 'Créateur PPT',
    description: 'Crée, modifie et analyse des présentations PowerPoint professionnelles avec officecli. Designs marqués, mises en page variées, impact visuel.',
  },
  'excel-creator': {
    name: 'Créateur Excel',
    description: 'Crée, modifie et analyse des classeurs Excel professionnels avec officecli. Modèles financiers, tableaux de bord, suivis et analyse de données.',
  },
  'morph-ppt': {
    name: 'Morph PPT',
    description: 'Crée des présentations animées Morph avec officecli. Plusieurs styles visuels et un flux complet, du sujet aux diapositives finalisées.',
  },
  'morph-ppt-3d': {
    name: 'Morph PPT 3D',
    description: 'Transforme un modèle GLB en présentation Morph cinématographique : gros plans, vue aérienne, contre-plongée et transitions fluides entre chaque plan.',
  },
  'pitch-deck-creator': {
    name: 'Créateur de pitch deck',
    description: 'Construit des pitch decks investisseurs, des présentations de lancement et des dossiers commerciaux : dégradés, graphiques, tableaux concurrentiels et notes d’orateur.',
  },
  'dashboard-creator': {
    name: 'Créateur de tableaux de bord',
    description: 'Transforme des données CSV ou tabulaires en tableaux de bord Excel soignés : cartes KPI, graphiques liés aux données, sparklines et mises en forme conditionnelles.',
  },
  'academic-paper': {
    name: 'Article académique',
    description: 'Rédige des articles de recherche et livres blancs structurés : sommaire Word natif, équations LaTeX vers OMML, bibliographie savante, notes et mises en page multi-colonnes.',
  },
  'financial-model-creator': {
    name: 'Créateur de modèle financier',
    description: 'Construit des modèles financiers pilotés par formules : états à trois tableaux, valorisation DCF, cap tables, scénarios, sensibilités et échéanciers de dette.',
  },
  'openclaw-setup': {
    name: 'Expert installation OpenClaw',
    description: 'Guide l’installation, le déploiement, la configuration et le dépannage d’OpenClaw, avec un diagnostic proactif et les bonnes pratiques de sécurité.',
  },
  'cowork': {
    name: 'Cowork',
    description: 'Exécution autonome de tâches : opérations de fichiers, traitement de documents et planification de flux de travail en plusieurs étapes.',
  },
  'game-3d': {
    name: 'Jeu 3D',
    description: 'Génère un jeu de plateforme 3D complet dans un seul fichier HTML.',
  },
  'ui-ux-pro-max': {
    name: 'UI/UX Pro Max',
    description: 'Intelligence de design UI/UX : 57 styles, 95 palettes de couleurs, 56 associations typographiques et les bonnes pratiques par pile technique.',
  },
  'planning-with-files': {
    name: 'Planification par fichiers',
    description: 'Planification à la Manus pour les tâches complexes : task_plan.md, findings.md et progress.md tiennent le plan à jour.',
  },
  'human-3-coach': {
    name: 'Coach HUMAN 3.0',
    description: 'Accompagnement personnel fondé sur le cadre HUMAN 3.0 : quatre quadrants (corps, esprit, esprit/âme, vocation) et trois niveaux.',
  },
  'social-job-publisher': {
    name: 'Publication d’offres d’emploi',
    description: 'Transforme une demande de recrutement en fiche de poste complète, produit les visuels et les publications sociales, puis donne la liste de vérification de publication.',
  },
  'moltbook': {
    name: 'moltbook',
    description: 'Le réseau social des agents IA : publier, commenter, voter et créer des communautés.',
  },
  'beautiful-mermaid': {
    name: 'Diagrammes Mermaid',
    description: 'Crée des organigrammes, diagrammes de séquence, d’état, de classes et d’autres diagrammes Mermaid soignés.',
  },
  'story-roleplay': {
    name: 'Jeu de rôle narratif',
    description: 'Jeu de rôle immersif : créez d’abord les personnages et le cadre, puis racontez.',
  },
  'word-form-creator': {
    name: 'Créateur de formulaires Word',
    description: 'Construit des formulaires Word remplissables (.docx) avec de vrais contrôles de contenu, cases à cocher et validation.',
  },
  'aionui-assistant': {
    name: 'Majordome AionUi',
    description: 'Tout-en-un pour AionUi : configurer les assistants, les compétences, les serveurs MCP et l’accès distant.',
  },
}

/**
 * The card face to display for one assistant.
 * @param assistant - catalog entry.
 * @param locale - active interface locale id.
 * @returns the French copy when the locale is `fr` and a translation exists, otherwise the catalog copy.
 */
export function assistantCopy(assistant: AionuiAssistant, locale: string): AssistantCopy {
  if (locale !== 'fr') return { name: assistant.name, description: assistant.description }
  return ASSISTANT_FR[assistant.id] ?? { name: assistant.name, description: assistant.description }
}
