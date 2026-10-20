/**
 * Dictation lifecycle: one utterance, the interface language, and a stop that
 * always ends the session.
 */
import { describe, expect, it } from 'vitest'
import { startDictation } from '../src/client/dictation.ts'
import type { SpeechResultEvent } from '../src/client/speech.ts'

/** A recognizer the test drives by hand. */
class FakeRecognition {
  /** Instances created since the last install. */
  static created: FakeRecognition[] = []

  lang = ''
  continuous = true
  interimResults = false
  starts = 0
  stops = 0
  onresult: ((event: SpeechResultEvent) => void) | null = null
  onerror: ((event: { error: string }) => void) | null = null
  onend: (() => void) | null = null

  constructor() {
    FakeRecognition.created.push(this)
  }

  start(): void { this.starts += 1 }
  stop(): void {
    this.stops += 1
    this.onend?.()
  }
  abort(): void {}
}

/** The globals a browser may expose. */
interface SpeechGlobal {
  SpeechRecognition?: typeof FakeRecognition | undefined
  webkitSpeechRecognition?: typeof FakeRecognition | undefined
}

/**
 * First instance, or a test failure.
 * @param list - instances the recognizer created.
 * @returns the first one.
 */
function first(list: FakeRecognition[]): FakeRecognition {
  const [value] = list
  if (value === undefined) throw new Error('expected a recognizer instance')
  return value
}

/**
 * Install the fake recognizer and clear its instances.
 * @returns the instance list the recognizer appends to.
 */
function install(): FakeRecognition[] {
  FakeRecognition.created = []
  const scope = globalThis as SpeechGlobal
  scope.SpeechRecognition = FakeRecognition
  return FakeRecognition.created
}

describe('startDictation', () => {
  it('listens for one utterance in the requested language', () => {
    const created = install()
    const session = startDictation('fr-FR', { onText: () => {}, onEnd: () => {}, onError: () => {} })
    expect(session).toBeDefined()
    const recognizer = first(created)
    expect(recognizer.lang).toBe('fr-FR')
    expect(recognizer.continuous).toBe(false)
    expect(recognizer.interimResults).toBe(true)
    expect(recognizer.starts).toBe(1)
  })

  it('stops the recognizer and ends the session on demand', () => {
    const created = install()
    let ends = 0
    const session = startDictation('fr-FR', { onText: () => {}, onEnd: () => { ends += 1 }, onError: () => {} })
    session?.stop()
    expect(first(created).stops).toBe(1)
    expect(ends).toBe(1)
  })

  it('reports a recognizer error with its code', () => {
    const created = install()
    const codes: string[] = []
    startDictation('fr-FR', { onText: () => {}, onEnd: () => {}, onError: (code) => { codes.push(code) } })
    first(created).onerror?.({ error: 'not-allowed' })
    expect(codes).toEqual(['not-allowed'])
  })

  it('returns undefined when the browser has no recognizer', () => {
    const scope = globalThis as SpeechGlobal
    scope.SpeechRecognition = undefined
    scope.webkitSpeechRecognition = undefined
    const session = startDictation('fr-FR', { onText: () => {}, onEnd: () => {}, onError: () => {} })
    expect(session).toBeUndefined()
  })
})
