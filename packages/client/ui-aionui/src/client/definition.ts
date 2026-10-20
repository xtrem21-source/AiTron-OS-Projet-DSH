/**
 * Stage one of this package's registration: what the `aionui-preview` type IS.
 *
 * The type is a page, not a viewer: it claims no address. The page lists the
 * Session's workspace files and previews the one the reader picks, which is the
 * AionUI preview panel's job — generated documents stay visible beside the
 * conversation instead of inside it.
 */
import type { TranslateNS } from '@deepseek-ai/dsh-client-locale/client'
import type { SidebarRightTabDefinition } from '@deepseek-ai/dsh-client-ui-sidebar-right/client'
import type {} from './locales.ts'

/** Panel id of the AionUI workspace page in the shell's keyed `main` seat. */
export const AIONUI_PANEL_ID = 'aionui'

/** The tab kind this package owns. */
export const PREVIEW_KIND = 'aionui-preview'

/** This implementation's identity in the tab system, and the key its body registers under. */
export const PREVIEW_ID = '@deepseek-ai/dsh-client-ui-aionui/preview'

/**
 * The preview type's registry definition.
 * @param t - namespace-bound translate, read fresh on every label call.
 * @returns the definition to register.
 */
export function previewDefinition(t: TranslateNS<'aionui'>): SidebarRightTabDefinition {
  return {
    id: PREVIEW_ID,
    kind: PREVIEW_KIND,
    priority: 'builtin',
    keepMounted: true,
    title: () => t('preview.title'),
    guide: [{
      id: 'preview',
      order: 40,
      title: () => t('preview.guide'),
      description: () => t('preview.guideDescription'),
    }],
  }
}
