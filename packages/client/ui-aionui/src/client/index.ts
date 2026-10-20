/**
 * Browser half: the AionUI shell.
 *
 * Three public paths, no private machinery: the workspace page into the keyed
 * `main` seat plus its `sidebar.panellist` entry, and the preview tab type into
 * `ctx.sidebarRightTabs` with its body and chip title in the keyed
 * `sidebar.right.pane.tab` seats. Assistant definitions are static catalog data
 * (see `catalog.ts`), so the browser needs no new Host service, and a session
 * started from the catalog carries the assistant role as its first user message
 * — a constant prefix the provider cache can keep.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type { RemoteResult } from '@deepseek-ai/dsh-api-remotes/client'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-session/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar-right/client'
import type {} from '@deepseek-ai/dsh-client-ui-workspace/client'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import type {
  WorkspaceDirectoryListing, WorkspaceFileBytes, WorkspaceFileText,
} from '@deepseek-ai/dsh-api-workspace-files/types'
import { AionuiPage } from './AionuiPage.tsx'
import type { AionuiInjected } from './AionuiPage.tsx'
import { AIONUI_PANEL_ID, PREVIEW_ID, previewDefinition } from './definition.ts'
import { en, NS, zh } from './locales.ts'
import { AionuiPanelIcon } from './PanelIcon.tsx'
import { PreviewBody } from './PreviewBody.tsx'
import type { PreviewInjected } from './PreviewBody.tsx'
import { PreviewTitle } from './PreviewTitle.tsx'

export type { AionuiAssistant } from './catalog.ts'
export type { AionuiInjected, AionuiPageProps } from './AionuiPage.tsx'
export type { PreviewBodyProps, PreviewInjected, PreviewState } from './PreviewBody.tsx'
export { AIONUI_ASSISTANTS, assistantPrompt } from './catalog.ts'

/** First text page of a previewed file, in lines. */
const PREVIEW_LINES = 4000

/**
 * Required browser services: slot registry, tab registry, Remote carrier and
 * its workspace-file namespace, session catalog, and Workspace navigation.
 */
export const inject = [
  'slots', 'locale', 'sidebarRightTabs', 'sidebarRight',
  'remote', 'remote.workspaceFiles', 'sessions', 'uiWorkspace',
]

/**
 * Client plugin body: dictionaries, the AionUI page, and the preview tab.
 * @param ctx - client root context carrying the registries and the Remote face.
 */
export function apply(ctx: ClientContext): void {
  const t = ctx.locale.bind(NS)
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-aionui: dictionaries')

  const face: AionuiInjected = {
    startAssistant: (prompt) => { ctx.uiWorkspace.startSession(undefined, { prompt, clearPreviousDraft: true }) },
    openSession: (sessionId) => { ctx.uiWorkspace.openSession(sessionId) },
    stopSession: async (sessionId) => { await ctx.uiWorkspace.archiveSession(sessionId, { stopActivity: true }) },
    newTask: () => { ctx.uiWorkspace.startSession() },
    // The locale face is already an observable: the renderer binds it as
    // `useLocale`, so the cards follow a language switch without a remount.
    hooks: { locale: ctx.locale },
  }
  ctx.slots.inject('main', () => ctx.slots.register({
    name: 'main',
    key: AIONUI_PANEL_ID,
    locale: NS,
    inject: (): AionuiInjected => face,
  }, AionuiPage))
  ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
    name: 'sidebar.panellist',
    id: AIONUI_PANEL_ID,
    order: 10,
    label: () => t('panel'),
    locale: NS,
  }, AionuiPanelIcon))

  // One face per Session: the body closes over it in effects, so its callbacks
  // must keep their identity for the tab record's whole life.
  const faces = new Map<SessionId, PreviewInjected>()
  const previewFace = (sessionId: SessionId): PreviewInjected => {
    const existing = faces.get(sessionId)
    if (existing !== undefined) return existing
    const created: PreviewInjected = {
      list: (path, signal): Promise<RemoteResult<WorkspaceDirectoryListing>> =>
        ctx.remote.workspaceFiles.list(sessionId, path, signal),
      readText: (path, signal): Promise<RemoteResult<WorkspaceFileText>> =>
        ctx.remote.workspaceFiles.read(sessionId, path, { offset: 1, limit: PREVIEW_LINES }, signal),
      readBytes: (path, signal): Promise<RemoteResult<WorkspaceFileBytes>> =>
        ctx.remote.workspaceFiles.readBytes(sessionId, path, {}, signal),
    }
    faces.set(sessionId, created)
    return created
  }
  ctx.effect(() => ctx.sidebarRightTabs.register(previewDefinition(t)), 'ui-aionui: preview type')
  ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register({
    name: 'sidebar.right.pane.tab',
    key: PREVIEW_ID,
    locale: NS,
    inject: previewFace,
  }, PreviewBody)), 'ui-aionui: preview body')
  ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab.title', () => ctx.slots.register({
    name: 'sidebar.right.pane.tab.title',
    key: PREVIEW_ID,
    locale: NS,
  }, PreviewTitle)), 'ui-aionui: preview title')
}
