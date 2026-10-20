/**
 * The preview tab's body: the Session workspace files on the left, the picked
 * one on the right.
 *
 * The body never awaits: the inject face performs the Remote calls, this
 * component only decides what to ask for and what to draw. Text pages render as
 * code, CSV/TSV as a table, HTML inside a sandboxed frame with scripts and
 * same-origin access denied, and bitmaps/PDF from an object URL built out of
 * the exact bytes the host returned.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { RemoteResult } from '@deepseek-ai/dsh-api-remotes/client'
import type {
  WorkspaceDirectoryEntry, WorkspaceDirectoryListing, WorkspaceFileBytes, WorkspaceFileText,
} from '@deepseek-ai/dsh-api-workspace-files/types'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from './locales.ts'
import css from './PreviewBody.module.css'

/** The preview tab's injected business face, bound to one Session. */
export interface PreviewInjected {
  /**
   * List one directory of the Session workspace.
   * @param path - absolute or workspace-relative directory.
   * @param signal - caller cancellation.
   */
  readonly list: (path: string, signal: AbortSignal) => Promise<RemoteResult<WorkspaceDirectoryListing>>
  /** Read the first text page of one file. @param path - absolute or workspace-relative file. @param signal - caller cancellation. */
  readonly readText: (path: string, signal: AbortSignal) => Promise<RemoteResult<WorkspaceFileText>>
  /** Read the complete bytes of one file. @param path - absolute or workspace-relative file. @param signal - caller cancellation. */
  readonly readBytes: (path: string, signal: AbortSignal) => Promise<RemoteResult<WorkspaceFileBytes>>
}

/** The body's composed props: the tab it draws, its face, and its copy. */
export type PreviewBodyProps = PropsRuntime<'sidebar.right.pane.tab'> & PreviewInjected & PropsLocale<'aionui'>

/** What the right pane currently shows. */
export type PreviewState =
  | { readonly kind: 'idle' }
  | { readonly kind: 'loading'; readonly path: string }
  | { readonly kind: 'text'; readonly path: string; readonly text: string; readonly truncated: boolean }
  | { readonly kind: 'media'; readonly path: string; readonly url: string; readonly mediaType: string }
  | { readonly kind: 'failed'; readonly path: string; readonly message: string }

/** Media types served from raw bytes, by lowercase suffix. */
const MEDIA_TYPES: Readonly<Record<string, string>> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  bmp: 'image/bmp',
  ico: 'image/x-icon',
  svg: 'image/svg+xml',
  pdf: 'application/pdf',
}

/** Rows rendered for a delimited table, so a large export stays responsive. */
const TABLE_ROWS = 200

/**
 * Lowercase suffix of a path, without the dot.
 * @param path - workspace file path.
 * @returns the suffix, or an empty string when the name has none.
 */
export function extensionOf(path: string): string {
  const name = path.replaceAll('\\', '/').split('/').pop() ?? ''
  const dot = name.lastIndexOf('.')
  return dot < 0 ? '' : name.slice(dot + 1).toLowerCase()
}

/**
 * Media type of a file the preview can render from bytes.
 * @param path - workspace file path.
 * @returns the media type, or undefined when the file is text.
 */
export function mediaTypeOf(path: string): string | undefined {
  return MEDIA_TYPES[extensionOf(path)]
}

/**
 * Order entries for display: directories first, then files, each by name.
 * @param entries - the listing as the host returned it.
 * @returns a new array in display order.
 */
export function orderEntries(entries: readonly WorkspaceDirectoryEntry[]): WorkspaceDirectoryEntry[] {
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
  return [...entries].sort((left, right) => {
    const group = Number(right.type === 'directory') - Number(left.type === 'directory')
    return group !== 0 ? group : collator.compare(left.name, right.name)
  })
}

/**
 * Split a delimited page into rows, capped for display.
 * @param text - the file page.
 * @param delimiter - column separator.
 * @returns the header row, the body rows, and whether rows were dropped.
 */
export function parseTable(text: string, delimiter: string): {
  readonly rows: readonly (readonly string[])[]
  readonly truncated: boolean
} {
  const lines = text.split('\n').filter(line => line.length > 0)
  const rows = lines.slice(0, TABLE_ROWS).map(line => line.split(delimiter).map(cell => cell.trim()))
  return { rows, truncated: lines.length > TABLE_ROWS }
}

/**
 * Join a directory and a child name with `/`, the key both sides agree on.
 * @param parent - absolute directory path.
 * @param name - child basename.
 * @returns the child's absolute path.
 */
export function childPath(parent: string, name: string): string {
  return `${parent.replace(/[/\\]+$/, '')}/${name}`
}

/** The document pane for one resolved state. */
function Document({ state, path, t }: {
  state: PreviewState
  path: string | undefined
  t: PropsLocale<'aionui'>['t']
}): ReactNode {
  if (state.kind === 'idle') return <p className={css.note}>{path === undefined ? t('preview.select') : t('preview.loading')}</p>
  if (state.kind === 'loading') return <p className={css.note}>{t('preview.loading')}</p>
  if (state.kind === 'failed') return <p className={css.note} data-preview-error>{t('preview.unavailable', { message: state.message })}</p>
  if (state.kind === 'media') {
    return state.mediaType === 'application/pdf'
      ? <iframe className={css.frame} title={state.path} src={state.url} />
      : <img className={css.image} src={state.url} alt={state.path} />
  }
  const extension = extensionOf(state.path)
  if (extension === 'html' || extension === 'htm') {
    return <iframe className={css.frame} title={state.path} sandbox="" srcDoc={state.text} />
  }
  if (extension === 'csv' || extension === 'tsv') {
    const table = parseTable(state.text, extension === 'csv' ? ',' : '\t')
    return (
      <div className={css.tableWrap}>
        <table className={css.table}>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={`${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`${cellIndex}`} className={rowIndex === 0 ? css.tableHead : undefined}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {table.truncated && <p className={css.note}>{t('preview.truncated', { lines: TABLE_ROWS })}</p>}
      </div>
    )
  }
  return (
    <>
      <pre className={css.code}>{state.text}</pre>
      {state.truncated && <p className={css.note}>{t('preview.truncated', { lines: 4000 })}</p>}
    </>
  )
}

/**
 * The preview body: file rail and document pane.
 * @param props - tab information, the face, and copy.
 * @returns the two-pane preview.
 */
export function PreviewBody({ useTabInfo, sessionId, useSessions, list, readText, readBytes, t }: PreviewBodyProps): ReactNode {
  const { tab } = useTabInfo()
  const cwd = useSessions(state => state.byId[sessionId]?.cwd)
  const [entries, setEntries] = useState<readonly WorkspaceDirectoryEntry[]>([])
  const [directoryFailure, setDirectoryFailure] = useState<string>()
  const [state, setState] = useState<PreviewState>({ kind: 'idle' })
  const [selected, setSelected] = useState<string>()
  const [revision, setRevision] = useState(0)
  const urls = useRef(new Set<string>())
  const request = useRef<AbortController>()

  useEffect(() => {
    if (cwd === undefined) return
    const controller = new AbortController()
    const abort = (): void => { controller.abort() }
    tab.signal.addEventListener('abort', abort, { once: true })
    list(cwd, controller.signal).then((result) => {
      if (controller.signal.aborted) return
      if (result.ok) {
        setEntries(orderEntries(result.value.entries))
        setDirectoryFailure(undefined)
      } else {
        setDirectoryFailure(result.error.message)
      }
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setDirectoryFailure(error instanceof Error ? error.message : String(error))
    })
    return () => {
      tab.signal.removeEventListener('abort', abort)
      controller.abort()
    }
  }, [cwd, list, revision, tab.signal])

  useEffect(() => () => {
    const created = urls.current
    for (const url of created) URL.revokeObjectURL(url)
    created.clear()
  }, [])

  useEffect(() => () => { request.current?.abort() }, [])

  const release = (): void => {
    for (const url of urls.current) URL.revokeObjectURL(url)
    urls.current.clear()
  }

  const open = (path: string): void => {
    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    release()
    setSelected(path)
    setState({ kind: 'loading', path })
    const mediaType = mediaTypeOf(path)
    if (mediaType !== undefined) {
      readBytes(path, controller.signal).then((result) => {
        if (controller.signal.aborted) return
        if (!result.ok) {
          setState({ kind: 'failed', path, message: result.error.message })
          return
        }
        try {
          const copy = new Uint8Array(result.value.data)
          const url = URL.createObjectURL(new Blob([copy], { type: mediaType }))
          urls.current.add(url)
          setState({ kind: 'media', path, url, mediaType })
        } catch (error: unknown) {
          setState({ kind: 'failed', path, message: error instanceof Error ? error.message : String(error) })
        }
      }).catch((error: unknown) => {
        if (!controller.signal.aborted) setState({ kind: 'failed', path, message: error instanceof Error ? error.message : String(error) })
      })
      return
    }
    readText(path, controller.signal).then((result) => {
      if (controller.signal.aborted) return
      setState(result.ok
        ? { kind: 'text', path, text: result.value.text, truncated: !result.value.eof }
        : { kind: 'failed', path, message: result.error.message })
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setState({ kind: 'failed', path, message: error instanceof Error ? error.message : String(error) })
    })
  }

  if (cwd === undefined) {
    return (
      <div className={css.root} data-preview-state="no-workspace">
        <p className={css.note}>{t('preview.noWorkspace')}</p>
      </div>
    )
  }

  return (
    <div className={css.root} data-preview-state="ready" data-preview-root={cwd}>
      <aside className={css.rail} aria-label={t('preview.files')}>
        <div className={css.railHead}>
          <span className={css.railTitle}>{t('preview.files')}</span>
          <button type="button" className={css.tool} onClick={() => { setRevision(value => value + 1) }}>
            {t('preview.refresh')}
          </button>
        </div>
        {directoryFailure !== undefined && <p className={css.note} data-preview-error>{t('preview.unavailable', { message: directoryFailure })}</p>}
        <ul className={css.files}>
          {entries.map(entry => (
            <li key={entry.name}>
              {entry.type === 'file'
                ? (
                  <button
                    type="button"
                    className={entry.name === selected ? css.fileActive : css.file}
                    data-preview-file={childPath(cwd, entry.name)}
                    onClick={() => { open(childPath(cwd, entry.name)) }}
                  >{entry.name}</button>
                )
                : <span className={css.folder} aria-disabled="true">{entry.name}</span>}
            </li>
          ))}
        </ul>
        {entries.length === 0 && directoryFailure === undefined && <p className={css.note}>{t('preview.empty')}</p>}
      </aside>
      <section className={css.document} aria-live="polite">
        <Document state={state} path={selected} t={t} />
      </section>
    </div>
  )
}
