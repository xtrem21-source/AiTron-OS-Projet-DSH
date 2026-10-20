/** The preview tab's chip title. */
import type { ReactNode } from 'react'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import css from './PreviewBody.module.css'

/**
 * The title as the chip and a floating panel's header show it.
 * @param props - the tab information hook.
 * @returns the pane glyph followed by the tab's title text.
 */
export function PreviewTitle({ useTabInfo }: PropsRuntime<'sidebar.right.pane.tab.title'>): ReactNode {
  const { tab } = useTabInfo()
  return (
    <>
      <span className={css.titleGlyph} aria-hidden="true">◫</span>
      {tab.title}
    </>
  )
}
