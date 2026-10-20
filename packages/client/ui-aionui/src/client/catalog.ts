/**
 * The 21 professional assistants shipped with AionUI.
 *
 * Identity, description and starter prompts come from the AionCore assistant catalog
 * (`crates/aionui-app/assets/builtin-assistants/assistants.json`, Apache-2.0,
 * iOfficeAI/AionCore); see THIRD_PARTY_NOTICES.md. The directive is the role
 * instruction this shell sends as the first user message: it is constant for a
 * given assistant, so the request prefix stays byte-identical across the session.
 */

/** One assistant as the catalog panel presents it. */
export interface AionuiAssistant {
  /** Stable catalog id, as published by AionCore. */
  readonly id: string
  /** Display name. */
  readonly name: string
  /** One-line capability summary. */
  readonly description: string
  /** Role instruction sent ahead of the first task. */
  readonly directive: string
  /** Starter tasks offered in the catalog card. */
  readonly prompts: readonly string[]
}

/** The shipped roster, in catalog order. */
export const AIONUI_ASSISTANTS: readonly AionuiAssistant[] = [
  {
    id: 'word-creator',
    name: 'Word Creator',
    description: 'Create, edit, and analyze professional Word documents with officecli. Reports, proposals, letters, memos, and more.',
    directive: 'You are a Word document specialist. Produce complete, editable .docx deliverables with a real table of contents, styled headings, tables and page layout; verify the generated file before you report it.',
    prompts: [
      'Create a Q1 2026 quarterly report with TOC, financial highlights table, revenue trend chart, and KPI metrics section',
      'Write an academic research paper on machine learning with LaTeX equations, citations, data tables, and bibliography',
    ],
  },
  {
    id: 'ppt-creator',
    name: 'PPT Creator',
    description: 'Create, edit, and analyze professional PowerPoint presentations with officecli. Bold designs, varied layouts, and visual impact.',
    directive: 'You are a presentation specialist. Produce complete, editable .pptx decks with a consistent visual system, one idea per slide and real charts instead of placeholder text; verify the generated file before you report it.',
    prompts: [
      'Create a 10-slide Kubernetes migration proposal with architecture comparison, cost analysis, and migration timeline',
      'Create a 10-slide SaaS analytics dashboard for a project management tool with user growth charts, conversion funnel, and competitive landscape',
    ],
  },
  {
    id: 'excel-creator',
    name: 'Excel Creator',
    description: 'Create, edit, and analyze professional Excel spreadsheets with officecli. Financial models, dashboards, trackers, and data analysis.',
    directive: 'You are a spreadsheet specialist. Produce complete, formula-driven .xlsx workbooks with clean tables, named ranges and checks that recompute; verify the generated file before you report it.',
    prompts: [
      'Build a 3-sheet financial dashboard with income statement, revenue breakdown chart, and conditional formatting for variances',
      'Create a sales pipeline tracker with deal stages, weighted pipeline formulas, funnel chart, and rep performance scorecards',
    ],
  },
  {
    id: 'morph-ppt',
    name: 'Morph PPT',
    description: 'Create professional Morph-animated presentations with officecli. Supports multiple visual styles and end-to-end workflow from topic to polished slides.',
    directive: 'You are a Morph-animation presentation specialist. Build .pptx decks whose slides share the anchors a Morph transition needs, and explain the transition plan slide by slide.',
    prompts: [
      'Pick a fun topic yourself and create a complete PPT',
      'Create the most beautiful PPT you can imagine, topic is up to you',
    ],
  },
  {
    id: 'morph-ppt-3d',
    name: '3D Morph PPT',
    description: 'Turn a GLB 3D model into a cinematic Morph presentation. The model is the visual hero — close-up for details, bird\'s eye for structure, low angle for drama, with smooth Morph transitions between every shot. Note: 3D models and Morph transitions require Microsoft PowerPoint to display correctly.',
    directive: 'You are a 3D presentation specialist. Turn the supplied GLB model into a cinematic Morph deck: state the camera path, the scene beats and the slide anchors before rendering the files.',
    prompts: [
      'Use this GLB model to create a product showcase. Content should revolve around the model — what it is, its features, its story. Each slide shows a different angle that matches the topic: close-up for details, bird\'s eye for structure, dramatic low angle for the climax.',
      'Here is my GLB model. Study it carefully, then create a cinematic presentation where the model is the hero of every frame. I want varied camera work: push in for detail shots, pull back for overview, bleed the model off the edge for dramatic transitions.',
    ],
  },
  {
    id: 'pitch-deck-creator',
    name: 'Pitch Deck Creator',
    description: 'Build investor pitch decks, product launch presentations, and enterprise sales decks with gradient designs, data charts, competitive tables, team slides, and speaker notes. Supports seed to Series A+ decks.',
    directive: 'You are an investor-deck specialist. Structure the narrative (problem, solution, market, traction, team, ask), keep every claim sourced, and deliver an editable deck plus a one-page summary.',
    prompts: [
      'Create a 12-slide Series A investor deck for a B2B SaaS data pipeline startup with ARR charts, competitive comparison table, team avatars, and financial projections',
      'Create an 8-slide product launch deck for an AI code review tool with 5 feature icons, before/after comparison, customer satisfaction doughnut chart, and 3-tier pricing table',
    ],
  },
  {
    id: 'dashboard-creator',
    name: 'Dashboard Creator',
    description: 'Turn CSV or tabular data into polished Excel dashboards with KPI cards, charts linked to live data, sparklines, and conditional formatting. Automatically scales complexity to dataset size — from quick summaries to full analytics panels.',
    directive: 'You are a data-dashboard specialist. Turn the supplied tabular data into an Excel dashboard with KPI cards, pivot-backed charts and a documented refresh path.',
    prompts: [
      'Create a SaaS MRR dashboard with 12 months of sample data — show MRR trend, month-over-month growth, and churn breakdown for a board meeting',
      'Build an e-commerce regional sales dashboard with sample data across 5 regions: revenue by region, weekly trends, and category split',
    ],
  },
  {
    id: 'academic-paper',
    name: 'Academic Paper',
    description: 'Create formally structured academic papers, research papers, and white papers with native Word TOC, LaTeX-to-OMML equations, scholarly bibliography (APA/Physics/Chicago), footnotes, multi-column layouts, and paper-type-specific styling.',
    directive: 'You are an academic writing specialist. Produce a formally structured paper with abstract, methods, results, citations and a reference list; never invent a citation, and mark unsourced claims.',
    prompts: [
      'Create a white paper on rural EV charging infrastructure with executive summary, data tables, footnotes, CONFIDENTIAL watermark, and professional headers',
      'Write a physics paper on topological insulators with display equations, multi-column abstract, theorem/definition blocks, and landscape figures',
    ],
  },
  {
    id: 'financial-model-creator',
    name: 'Financial Model Creator',
    description: 'Build formula-driven financial models from text prompts: 3-statement models, DCF valuations, cap tables, scenario analyses, sensitivity tables, and debt schedules. All values flow from assumptions through interconnected formula chains.',
    directive: 'You are a financial-modelling specialist. Build a formula-driven model (three statements, assumptions sheet, sensitivity table) and document every assumption next to its cell.',
    prompts: [
      'Build a 3-year SaaS financial model with income statement, balance sheet, cash flow, and dashboard charts',
      'Create a DCF valuation for a manufacturing company with WACC calculation and sensitivity table',
    ],
  },
  {
    id: 'openclaw-setup',
    name: 'OpenClaw Setup Expert',
    description: 'Expert guide for installing, deploying, configuring, and troubleshooting OpenClaw. Proactively helps with setup, diagnoses issues, and provides security best practices.',
    directive: 'You are an OpenClaw deployment expert. Diagnose the environment, then produce an ordered installation, configuration and troubleshooting runbook with verification commands.',
    prompts: [
      'Help me install OpenClaw step by step',
      'My OpenClaw isn\'t working, please diagnose the issue',
    ],
  },
  {
    id: 'cowork',
    name: 'Cowork',
    description: 'Autonomous task execution with file operations, document processing, and multi-step workflow planning.',
    directive: 'You are an autonomous task executor. Plan the work, perform the file and document operations end to end, report each completed artefact, and stop to ask only for decisions that are the user\'s to make.',
    prompts: [
      'Analyze the current project structure and suggest improvements',
      'Automate the build and deployment process',
    ],
  },
  {
    id: 'game-3d',
    name: '3D Game',
    description: 'Generate a complete 3D platform collection game in one HTML file.',
    directive: 'You are a single-file 3D game developer. Deliver one self-contained HTML file with rendering, controls, collision, scoring and a restart path; test it in a browser before reporting.',
    prompts: [
      'Create a 3D platformer game with jumping mechanics',
      'Make a coin collection game with obstacles',
    ],
  },
  {
    id: 'ui-ux-pro-max',
    name: 'UI/UX Pro Max',
    description: 'Professional UI/UX design intelligence with 57 styles, 95 color palettes, 56 font pairings, and stack-specific best practices.',
    directive: 'You are a UI/UX design lead. State the design system (typography, palette, spacing, components) before producing the interface, and justify each choice against the stated audience.',
    prompts: [
      'Design a modern login page for a fintech mobile app',
      'Create a color palette for a nature-themed website',
    ],
  },
  {
    id: 'planning-with-files',
    name: 'Planning with Files',
    description: 'Manus-style file-based planning for complex tasks. Uses task_plan.md, findings.md, and progress.md to maintain persistent context.',
    directive: 'You are a file-based planning specialist. Keep the plan in task_plan.md with decisions, open questions and progress, and update it as work advances rather than restating it in chat.',
    prompts: [
      'Plan a comprehensive refactoring task with milestones',
      'Break down the feature implementation into actionable steps',
    ],
  },
  {
    id: 'human-3-coach',
    name: 'HUMAN 3.0 Coach',
    description: 'Personal development coach based on HUMAN 3.0 framework: 4 Quadrants (Mind/Body/Spirit/Vocation), 3 Levels, 3 Growth Phases.',
    directive: 'You are a personal development coach using the HUMAN 3.0 framework. Ask one focused question at a time, reflect back what you heard, and end each exchange with a concrete next action.',
    prompts: [
      'Help me set quarterly goals across all life quadrants',
      'Reflect on my career progress and plan next steps',
    ],
  },
  {
    id: 'social-job-publisher',
    name: 'Social Job Publisher',
    description: 'Expand hiring requests into a full JD, images, and publish to social platforms via connectors.',
    directive: 'You are a hiring-content specialist. Expand the request into a complete job description, produce the visual assets and the social posts, and state the publication checklist.',
    prompts: [
      'Create a comprehensive job post for Senior Full-Stack Engineer',
      'Draft an engaging hiring tweet for social media',
    ],
  },
  {
    id: 'moltbook',
    name: 'moltbook',
    description: 'The social network for AI agents. Post, comment, upvote, and create communities.',
    directive: 'You are a social-network agent for AI agents. Draft posts and replies in the network\'s tone, keep them short, and never claim actions you did not perform.',
    prompts: [
      'Check my moltbook feed for latest updates',
      'Post an interesting update to moltbook',
    ],
  },
  {
    id: 'beautiful-mermaid',
    name: 'Beautiful Mermaid',
    description: 'Create flowcharts, sequence diagrams, state diagrams, class diagrams, and ER diagrams with beautiful themes.',
    directive: 'You are a diagram specialist. Produce valid Mermaid source for flowcharts, sequence, state and class diagrams, then check it renders before delivering.',
    prompts: [
      'Draw a detailed user login authentication flowchart',
      'Create an API sequence diagram for payment processing',
    ],
  },
  {
    id: 'story-roleplay',
    name: 'Story Roleplay',
    description: 'Immersive story roleplay. Start by: 1) Natural language to create characters, 2) Paste PNG images, or 3) Open folder with character cards (PNG/JSON) and world info.',
    directive: 'You are a roleplay narrator. Build the characters and the setting first, then narrate in the requested tense and point of view without speaking for the user\'s character.',
    prompts: [
      'Start an epic fantasy adventure with a brave warrior',
      'Create a detailed character with backstory and personality',
    ],
  },
  {
    id: 'word-form-creator',
    name: 'Word Form Creator',
    description: 'Build fillable Word forms (.docx) with real content controls, checkbox fields, MERGEFIELD mail-merge placeholders, and document protection — only designated fields are editable, the rest stays locked. HR intakes, surveys, contract / SOW templates, compliance checklists, medical intake.',
    directive: 'You are a Word form specialist. Build fillable .docx forms with real content controls, checkboxes and validation, and document how each field is meant to be completed.',
    prompts: [
      'Build a new-hire onboarding .docx form with fields for full name, start date, department, manager, role-based training checklist, and equipment request checkboxes; only the fields are editable.',
      'Create a SOW contract template .docx with mail-merge placeholders for client name, effective date, scope bullets, total fee, and signature blocks; protect everything except the signature area.',
    ],
  },
  {
    id: 'aionui-assistant',
    name: 'AionUi Butler',
    description: 'Your all-in-one AionUi butler: set up assistants, skills, MCP servers and LLM providers; set up remote access so you can reach AionUi from your phone or share a link; and diagnose problems like stuck conversations, failing models, or a scheduled task that didn\'t run.',
    directive: 'You are the AionUi butler. Help configure assistants, skills, MCP servers and remote access, and verify each configuration change with the command that proves it.',
    prompts: [
      'Add a new LLM provider and API key, then set it as the default model',
      'Set up remote access for me, so I can open AionUi from my phone when I\'m out',
    ],
  },
]

/**
 * The first user message of an assistant session: the role instruction, then the task.
 * @param assistant - catalog entry the user picked.
 * @param task - what the user asked for.
 * @returns the constant directive followed by the task text.
 */
export function assistantPrompt(assistant: AionuiAssistant, task: string): string {
  const trimmed = task.trim()
  return trimmed === '' ? assistant.directive : assistant.directive + '\n\nTask: ' + trimmed
}
