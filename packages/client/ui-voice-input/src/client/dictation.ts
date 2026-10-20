/** One running dictation: start the recognizer and route its events. */
import { speechRecognitionConstructor, transcriptOf } from './speech.ts'

/** What the button hears back from the recognizer. */
export interface DictationHandlers {
  /**
   * One recognized fragment.
   * @param text - the fragment.
   * @param final - whether the recognizer settled it.
   */
  onText(text: string, final: boolean): void
  /** The session ended, by stop, silence or error. */
  onEnd(): void
  /** The recognizer refused or failed. @param code - machine-readable reason. */
  onError(code: string): void
}

/** A running dictation the caller can stop. */
export interface DictationSession {
  /** Stop listening and flush the pending fragment. */
  stop(): void
}

/**
 * Start one dictation in the given language.
 * @param language - BCP 47 tag the recognizer listens for.
 * @param handlers - fragment, end and error callbacks.
 * @returns the running session, or undefined when the browser has no recognizer.
 */
export function startDictation(language: string, handlers: DictationHandlers): DictationSession | undefined {
  const Constructor = speechRecognitionConstructor()
  if (Constructor === undefined) return undefined
  const recognition = new Constructor()
  recognition.lang = language
  // One utterance per session: the recognizer stops itself at the first pause,
  // which is what keeps ambient noise out of a long dictation.
  recognition.continuous = false
  recognition.interimResults = true
  let ended = false
  const end = (): void => {
    if (ended) return
    ended = true
    handlers.onEnd()
  }
  recognition.onresult = (event) => {
    handlers.onText(transcriptOf(event), event.results[event.results.length - 1]?.isFinal === true)
  }
  recognition.onerror = (event) => { handlers.onError(event.error) }
  recognition.onend = () => { end() }
  try {
    recognition.start()
  } catch (error: unknown) {
    handlers.onError(error instanceof Error ? error.message : 'start-failed')
    return undefined
  }
  return {
    stop: () => {
      try {
        recognition.stop()
      } catch (error: unknown) {
        // Stopping a recognizer that already ended is harmless; the session end
        // callback has run or is about to, so the failure needs no report.
        void error
      }
    },
  }
}
