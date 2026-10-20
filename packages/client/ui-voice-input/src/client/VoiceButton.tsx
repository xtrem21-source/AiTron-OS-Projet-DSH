/**
 * The composer's dictation button.
 *
 * One gesture starts and stops the browser recognizer, and the session ends on
 * its own at the first pause (`continuous = false`). Recognized fragments
 * replace the draft from the text captured when dictation started, so an
 * interim hypothesis never accumulates into a growing tail and an existing
 * draft is never discarded by an empty capture. The draft write goes through
 * the session's own `inputActions`, which is the only face a composer component
 * may use.
 *
 * The microphone yields to the keyboard and to submission: a key press or a
 * pointer down outside this button stops it, and so does the composer leaving
 * its `plain` phase, whether that came from the Send button or from Enter.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { DictationHandlers, DictationSession } from './dictation.ts'
import type {} from './locales.ts'
import css from './VoiceButton.module.css'

/** What the owning plugin hands the button. */
export interface DictationInjected {
  /** Whether this browser exposes a speech recognizer. */
  readonly supported: boolean
  /** BCP 47 tag for the active interface language. @returns the tag. */
  readonly language: () => string
  /**
   * Start one dictation.
   * @param language - BCP 47 tag to listen for.
   * @param handlers - fragment, end and error callbacks.
   * @returns the running session, or undefined when unsupported.
   */
  readonly start: (language: string, handlers: DictationHandlers) => DictationSession | undefined
}

/** The button's composed props: session input face, injection, and copy. */
export type VoiceButtonProps = PropsRuntime<'conversation.input.right'> & DictationInjected & PropsLocale<'voiceInput'>

/** What the button is doing. */
type Phase = 'idle' | 'listening' | 'failed'

/** Keys that are modifiers alone; pressing one is not typing and keeps the microphone open. */
const MODIFIER_KEYS = new Set(['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'])

/**
 * Render the dictation toggle.
 * @param props - input actions, the recognizer face, and copy.
 * @returns the microphone button.
 */
export function VoiceButton({ supported, language, start, inputActions, useInput, t }: VoiceButtonProps): ReactNode {
  const draft = useInput(state => state.draft)
  const submission = useInput(state => state.phase)
  const [phase, setPhase] = useState<Phase>('idle')
  const [failure, setFailure] = useState<string>()
  const session = useRef<DictationSession>()
  const initialDraft = useRef('')
  const button = useRef<HTMLButtonElement>(null)

  const stop = useCallback((): void => {
    session.current?.stop()
    session.current = undefined
    setPhase('idle')
    // The editor keeps the caret: the toggle never holds focus after dictation.
    button.current?.blur()
  }, [])

  useEffect(() => () => { session.current?.stop() }, [])

  // Typing or clicking anywhere but the toggle gives the keyboard back its
  // priority over the microphone.
  useEffect(() => {
    if (phase !== 'listening') return
    const onKey = (event: KeyboardEvent): void => {
      if (MODIFIER_KEYS.has(event.key)) return
      stop()
    }
    const onPointer = (event: Event): void => {
      const target = event.target
      if (target instanceof Node) {
        if (button.current?.contains(target) === true) return
      }
      stop()
    }
    document.addEventListener('keydown', onKey, true)
    document.addEventListener('pointerdown', onPointer, true)
    return () => {
      document.removeEventListener('keydown', onKey, true)
      document.removeEventListener('pointerdown', onPointer, true)
    }
  }, [phase, stop])

  // Submission (Send button or Enter) ends the capture before the draft settles.
  useEffect(() => {
    if (submission !== 'plain') {
      if (phase === 'listening') stop()
    }
  }, [phase, stop, submission])

  const begin = (): void => {
    initialDraft.current = draft
    setFailure(undefined)
    const started = start(language(), {
      onText: (text) => {
        const head = initialDraft.current.trimEnd()
        inputActions.setDraft(head === '' ? text : `${head} ${text}`)
      },
      onEnd: () => {
        session.current = undefined
        setPhase('idle')
      },
      onError: (code) => {
        session.current = undefined
        setFailure(code)
        setPhase('failed')
      },
    })
    if (started === undefined) {
      setFailure('unsupported')
      setPhase('failed')
      return
    }
    session.current = started
    setPhase('listening')
  }

  const listening = phase === 'listening'
  const label = listening ? t('stop') : t('start')
  const hint = supported ? label : t('unsupported')
  const notice = failure === undefined ? undefined : failure === 'unsupported' ? t('unsupported') : t('failed', { code: failure })

  return (
    <span className={css.slot}>
      <button
        ref={button}
        type="button"
        className={listening ? css.active : css.button}
        aria-pressed={listening}
        aria-label={listening ? t('listening') : label}
        title={hint}
        disabled={!supported}
        data-voice-state={phase}
        onMouseDown={(event) => { event.preventDefault() }}
        onClick={() => {
          if (listening) stop()
          else begin()
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.6" />
          <path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      <span className={css.notice} role="status" aria-live="polite">{notice}</span>
    </span>
  )
}
