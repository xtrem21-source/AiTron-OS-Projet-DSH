/**
 * The AionUI workspace page: the assistant catalog and the parallel task board.
 *
 * Both views read the shipped catalog and the Session list through framework
 * hooks; every mutation is a callback from the inject face, so the component
 * holds no transport state and never sees `ctx`. The page keeps no store: its
 * selected view is component-private state, which is exactly what a remount may
 * reset.
 */
import { useState, type ReactNode } from 'react'
import type { UseSessions, UseSessionStatus } from '@deepseek-ai/dsh-client-ui-session/client'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { LocaleSnapshot } from '@deepseek-ai/dsh-client-locale/client'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import { assistantCopy } from './assistant-fr.ts'
import { AIONUI_ASSISTANTS, assistantPrompt, type AionuiAssistant } from './catalog.ts'
import type {} from './locales.ts'
import { AionuiMark } from './PanelIcon.tsx'
import css from './AionuiPage.module.css'

/** Callbacks and live sources the page needs from its owning plugin. */
export interface AionuiInjected {
  /** Interpolated copy. @param prompt - role directive plus task. */
  readonly startAssistant: (prompt: string) => void
  /** Show a Session in the conversation surface. @param sessionId - Session to open. */
  readonly openSession: (sessionId: SessionId) => void
  /** Stop the Session's running work and archive it. @param sessionId - Session to stop. */
  readonly stopSession: (sessionId: SessionId) => Promise<void>
  /** Start an empty Session in the current Workspace. */
  readonly newTask: () => void
  hooks: {
    /** Active interface locale, bound by the renderer as `useLocale`. */
    locale: {
      getSnapshot(): LocaleSnapshot
      subscribe(listener: () => void): () => void
    }
  }
}

/** The page's composed props: shell data, the inject face, and its copy. */
export type AionuiPageProps = PropsRuntime<'main'> & InjectFace<AionuiInjected> & PropsLocale<'aionui'>

/** The page's two views. */
type View = 'assistants' | 'tasks'

/**
 * One assistant card: the catalog identity, its starter tasks, and the task box
 * that starts a Session with this assistant's role.
 * @param props - catalog entry, the start callback, and copy.
 * @returns the card.
 */
function AssistantCard({ assistant, locale, startAssistant, t }: {
  assistant: AionuiAssistant
  locale: string
  startAssistant: AionuiInjected['startAssistant']
  t: PropsLocale<'aionui'>['t']
}): ReactNode {
  const copy = assistantCopy(assistant, locale)
  const [task, setTask] = useState('')
  const [expanded, setExpanded] = useState(false)
  const start = (): void => {
    startAssistant(assistantPrompt(assistant, task))
    setTask('')
    setExpanded(false)
  }
  return (
    <li className={css.card} data-aionui-assistant={assistant.id}>
      <div className={css.cardHead}>
        <span className={css.cardMark} aria-hidden="true">{copy.name.slice(0, 1)}</span>
        <div className={css.cardHeading}>
          <h3 className={css.cardTitle}>{copy.name}</h3>
          <p className={css.cardDescription}>{copy.description}</p>
        </div>
      </div>
      <div className={css.cardActions}>
        <button type="button" className={css.primary} onClick={() => { setExpanded(value => !value) }}>
          {expanded ? t('assistants.cancel') : t('assistants.start')}
        </button>
      </div>
      {expanded && (
        <div className={css.cardForm}>
          <label className={css.label} htmlFor={`aionui-task-${assistant.id}`}>{t('assistants.taskLabel')}</label>
          <textarea
            id={`aionui-task-${assistant.id}`}
            className={css.textarea}
            rows={3}
            value={task}
            placeholder={t('assistants.taskPlaceholder')}
            onChange={(event) => { setTask(event.currentTarget.value) }}
          />
          {assistant.prompts.length > 0 && (
            <>
              <span className={css.label}>{t('assistants.starters')}</span>
              <ul className={css.starters}>
                {assistant.prompts.map(prompt => (
                  <li key={prompt}>
                    <button type="button" className={css.starter} onClick={() => { setTask(prompt) }}>{prompt}</button>
                  </li>
                ))}
              </ul>
            </>
          )}
          <button type="button" className={css.primary} onClick={start}>{t('assistants.start')}</button>
        </div>
      )}
    </li>
  )
}

/**
 * The catalog view: every shipped assistant, in catalog order.
 * @param props - the start callback and copy.
 * @returns the card grid.
 */
function AssistantGrid({ locale, startAssistant, t }: Pick<AionuiInjected, 'startAssistant'> & { locale: string; t: PropsLocale<'aionui'>['t'] }): ReactNode {
  return (
    <section className={css.section} aria-label={t('assistants.title')}>
      <header className={css.sectionHead}>
        <h2 className={css.sectionTitle}>{t('assistants.title')}</h2>
        <p className={css.sectionSubtitle}>{t('assistants.subtitle')}</p>
      </header>
      <ul className={css.grid}>
        {AIONUI_ASSISTANTS.map(assistant => (
          <AssistantCard key={assistant.id} assistant={assistant} locale={locale} startAssistant={startAssistant} t={t} />
        ))}
      </ul>
    </section>
  )
}

/** What one task row receives. */
interface TaskRowProps {
  readonly id: SessionId
  readonly useSessions: UseSessions
  readonly useSessionStatus: UseSessionStatus
  readonly openSession: AionuiInjected['openSession']
  readonly stopSession: AionuiInjected['stopSession']
  readonly t: PropsLocale<'aionui'>['t']
}

/**
 * One Session row: its title, live phase, last update, and the two gestures.
 * @param props - the Session identity, the framework hooks, and the callbacks.
 * @returns the row, or nothing while the catalog has not materialized it yet.
 */
function TaskRow({ id, useSessions, useSessionStatus, openSession, stopSession, t }: TaskRowProps): ReactNode {
  const summary = useSessions(state => state.byId[id])
  const status = useSessionStatus(map => map.get(id))
  const [confirming, setConfirming] = useState(false)
  const [failure, setFailure] = useState<string>()
  if (summary === undefined) return null
  const phase = status?.running === true
    ? 'running'
    : status?.pendingInteraction !== undefined
      ? 'waiting'
      : status?.completionUnread === true ? 'unread' : 'idle'
  const stop = async (): Promise<void> => {
    if (!confirming) {
      setConfirming(true)
      return
    }
    try {
      await stopSession(id)
      setFailure(undefined)
    } catch (error: unknown) {
      setFailure(error instanceof Error ? error.message : String(error))
    }
    setConfirming(false)
  }
  return (
    <li className={css.task} data-aionui-task={id} data-aionui-phase={phase}>
      <div className={css.taskMain}>
        <span className={css.phase} data-phase={phase}>{t(phase === 'running' ? 'tasks.running' : phase === 'waiting' ? 'tasks.waiting' : phase === 'unread' ? 'tasks.unread' : 'tasks.idle')}</span>
        <span className={css.taskTitle}>{summary.blank ? t('tasks.blank') : summary.displayTitle}</span>
        <span className={css.taskTime}>{t('tasks.updated', { time: new Date(summary.updatedAt).toLocaleTimeString() })}</span>
      </div>
      {failure !== undefined && <p className={css.taskFailure}>{t('tasks.stopFailed', { message: failure })}</p>}
      <div className={css.taskActions}>
        <button type="button" className={css.secondary} onClick={() => { openSession(id) }}>{t('tasks.open')}</button>
        <button type="button" className={css.danger} onClick={() => { void stop() }}>
          {confirming ? t('tasks.stopConfirm') : t('tasks.stop')}
        </button>
      </div>
    </li>
  )
}

/**
 * The task board: every catalogued Session, refreshest first.
 * @param props - the framework hooks and callbacks.
 * @returns the list, or the empty state.
 */
function TaskBoard({ useSessions, useSessionStatus, openSession, stopSession, t }: Omit<TaskRowProps, 'id'>): ReactNode {
  const ids = useSessions(state => state.ids)
  return (
    <section className={css.section} aria-label={t('tasks.title')}>
      <header className={css.sectionHead}>
        <h2 className={css.sectionTitle}>{t('tasks.title')}</h2>
        <p className={css.sectionSubtitle}>{t('tasks.subtitle')}</p>
      </header>
      {ids.length === 0
        ? <p className={css.empty}>{t('tasks.empty')}</p>
        : (
          <ul className={css.taskList}>
            {ids.map(id => (
              <TaskRow
                key={id}
                id={id}
                useSessions={useSessions}
                useSessionStatus={useSessionStatus}
                openSession={openSession}
                stopSession={stopSession}
                t={t}
              />
            ))}
          </ul>
        )}
    </section>
  )
}

/**
 * The AionUI page: one header, two views.
 * @param props - shell hooks, the inject face, and copy.
 * @returns the page.
 */
export function AionuiPage(props: AionuiPageProps): ReactNode {
  const { startAssistant, openSession, stopSession, newTask, t, useSessions, useSessionStatus, useLocale } = props
  const locale = useLocale(snapshot => snapshot.active)
  const [view, setView] = useState<View>('assistants')
  return (
    <div className={css.root} data-aionui-page>
      <header className={css.header}>
        <span className={css.brand}><AionuiMark size={18} />AionUi</span>
        <nav className={css.tabs} aria-label={t('panel')}>
          <button
            type="button"
            className={view === 'assistants' ? css.tabActive : css.tab}
            aria-pressed={view === 'assistants'}
            onClick={() => { setView('assistants') }}
          >{t('tabs.assistants')}</button>
          <button
            type="button"
            className={view === 'tasks' ? css.tabActive : css.tab}
            aria-pressed={view === 'tasks'}
            onClick={() => { setView('tasks') }}
          >{t('tabs.tasks')}</button>
        </nav>
        <button type="button" className={css.primary} onClick={newTask}>{t('tasks.new')}</button>
      </header>
      <div className={css.body}>
        {view === 'assistants'
          ? <AssistantGrid locale={locale} startAssistant={startAssistant} t={t} />
          : (
            <TaskBoard
              useSessions={useSessions}
              useSessionStatus={useSessionStatus}
              openSession={openSession}
              stopSession={stopSession}
              t={t}
            />
          )}
      </div>
    </div>
  )
}
