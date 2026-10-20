/**
 * The slice of the Web Speech API this package uses.
 *
 * The DOM library ships no `SpeechRecognition` types, and the implementation is
 * prefixed in Chromium, so the plugin declares the structural minimum and
 * resolves the constructor at runtime.
 */

/** One alternative of a recognition result. */
export interface SpeechAlternative {
  /** Recognized text for this alternative. */
  readonly transcript: string
  /** Recognizer confidence in [0, 1]. */
  readonly confidence: number
}

/** One recognition result. */
export interface SpeechResult {
  /** Whether the recognizer considers this result stable. */
  readonly isFinal: boolean
  /** Number of alternatives. */
  readonly length: number
  /** First alternative. */
  readonly [index: number]: SpeechAlternative
}

/** Results of one recognition event, oldest first. */
export interface SpeechResultList {
  /** Number of results. */
  readonly length: number
  /** One result by position. */
  readonly [index: number]: SpeechResult
}

/** The `result` event payload. */
export interface SpeechResultEvent {
  /** First result that changed in this event. */
  readonly resultIndex: number
  /** Every result of the current session. */
  readonly results: SpeechResultList
}

/** The `error` event payload. */
export interface SpeechErrorEvent {
  /** Machine-readable error code, such as `not-allowed` or `no-speech`. */
  readonly error: string
}

/** One recognition session, as the browser exposes it. */
export interface SpeechRecognitionLike {
  /** BCP 47 language tag the recognizer listens for. */
  lang: string
  /** Whether recognition continues after the first pause. */
  continuous: boolean
  /** Whether unstable hypotheses are delivered. */
  interimResults: boolean
  /** Begin listening. */
  start(): void
  /** Stop listening and flush the last result. */
  stop(): void
  /** Stop listening and discard the pending result. */
  abort(): void
  onresult: ((event: SpeechResultEvent) => void) | null
  onerror: ((event: SpeechErrorEvent) => void) | null
  onend: (() => void) | null
}

/** Constructor shape of the recognizer. */
export interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionLike
}

/** The two globals a browser may expose. */
interface SpeechScope {
  readonly SpeechRecognition?: SpeechRecognitionConstructor
  readonly webkitSpeechRecognition?: SpeechRecognitionConstructor
}

/**
 * Resolve the recognizer constructor the browser exposes.
 * @returns the constructor, or undefined when the browser has no speech input.
 */
export function speechRecognitionConstructor(): SpeechRecognitionConstructor | undefined {
  const scope = globalThis as Partial<SpeechScope>
  return scope.SpeechRecognition ?? scope.webkitSpeechRecognition
}

/**
 * Join the results that changed in one event.
 * @param event - the recognition event.
 * @returns the recognized text of this event.
 */
export function transcriptOf(event: SpeechResultEvent): string {
  let text = ''
  for (let index = event.resultIndex; index < event.results.length; index += 1) {
    const alternative = event.results[index]?.[0]
    if (alternative !== undefined) text += alternative.transcript
  }
  return text
}
