/**
 * The linear protocol's contract: the section text never varies, and a head
 * injection is the one shape the audit must find.
 */
import { describe, expect, it } from 'vitest'
import { LINEAR_PROTOCOL, headInjectionAt } from '../src/index.ts'

describe('headInjectionAt', () => {
  it('accepts an empty history', () => {
    expect(headInjectionAt([])).toBeUndefined()
  })

  it('accepts head consolidation before the first user message', () => {
    expect(headInjectionAt(['system/message', 'system/message', 'user/message', 'assistant/message'])).toBeUndefined()
  })

  it('finds a system node appended after user history', () => {
    expect(headInjectionAt(['system/message', 'user/message', 'assistant/message', 'system/message'])).toBe(3)
  })

  it('reports the first offending node only', () => {
    expect(headInjectionAt(['user/message', 'system/message', 'system/message'])).toBe(1)
  })

  it('ignores non-system events after user history', () => {
    expect(headInjectionAt(['user/message', 'assistant/message', 'tool/result'])).toBeUndefined()
  })
})

describe('LINEAR_PROTOCOL', () => {
  it('carries no interpolation syntax', () => {
    expect(LINEAR_PROTOCOL).not.toContain('{{')
    expect(LINEAR_PROTOCOL).not.toContain('${')
  })

  it('carries no clock reading', () => {
    expect(LINEAR_PROTOCOL).not.toMatch(/\d{1,2}:\d{2}/u)
  })

  it('carries no filesystem path', () => {
    expect(LINEAR_PROTOCOL).not.toMatch(/[\w-]+:[/\\]/u)
  })

  it('is a constant string', () => {
    expect(typeof LINEAR_PROTOCOL).toBe('string')
    expect(LINEAR_PROTOCOL.length).toBeGreaterThan(0)
  })
})
