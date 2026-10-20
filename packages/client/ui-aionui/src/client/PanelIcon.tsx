/** The AionUI mark: the sidebar entry glyph and the page's brand glyph. */
import type { ReactNode } from 'react'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'

/**
 * The mark itself, free of slot props so the page can draw it too.
 * @param props - the glyph edge length in pixels.
 * @returns four panes around one workspace.
 */
export function AionuiMark({ size }: { readonly size: number }): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="10" width="8" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

/**
 * The sidebar's AionUI entry glyph.
 * @param props - the panel entry's size in pixels.
 * @returns the inline glyph.
 */
export function AionuiPanelIcon({ size }: PropsRuntime<'sidebar.panellist'>): ReactNode {
  return <AionuiMark size={size} />
}
