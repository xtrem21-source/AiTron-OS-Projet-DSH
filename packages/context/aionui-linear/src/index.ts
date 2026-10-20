/**
 * Linear prompt protocol for the AionUI shell.
 *
 * DeepSeek prices a cache hit on the longest unchanged request prefix, so the
 * shell must never rewrite the head of a request between steps. This plugin
 * contributes one static, non-interpolated section at the tail of the system
 * prompt, and audits every step's durable history for head injections: a
 * `system/message` appended after the first `user/message` moves the prefix and
 * forces a miss. The audit never mutates history; `strict` turns a violation
 * into a refused step instead of a warning.
 *
 * @module @deepseek-ai/dsh-aionui-linear
 */

import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import type { Agent } from '@deepseek-ai/dsh-agent'
import { SessionSeq } from '@deepseek-ai/dsh-session'
import type {} from '@deepseek-ai/dsh-system-prompt'

/** Cordis plugin name used by loader diagnostics. */
export const name = 'aionui-linear'

/** The services the audit waits for: the agent registry and prompt assembly. */
export const inject = ['agents', 'systemPrompt']

/**
 * The protocol text. Constant by construction: no clock, no path, no variable,
 * no number that changes between steps, so the section is byte-identical on
 * every assembly.
 */
export const LINEAR_PROTOCOL = [
  'AionUI linear protocol: keep the request prefix immutable.',
  'Session history is append-only; never rewrite, reorder, summarize or delete an earlier message.',
  'Everything that varies between steps (clock, working directory, environment, status) belongs to the tail, never to the head.',
].join(' ')

/** Request-preparation audit configuration. Invalid values fail plugin load. */
export interface Config {
  /** Whether the protocol section and the audit are active. Defaults to true. */
  enabled?: boolean
  /** Order of the protocol section; must stay above every persona and harness section. Defaults to 9000. */
  sectionOrder?: number
  /** Refuse the step on a head injection instead of warning. Defaults to false. */
  strict?: boolean
}

/** Schemastery validation for {@link Config}. */
export const Config: z<Config> = z.object({
  enabled: z.boolean(),
  sectionOrder: z.number().min(0),
  strict: z.boolean(),
})

/**
 * Index of the first head injection in a durable event sequence.
 *
 * A system node appended before any user message is head consolidation and
 * keeps the prefix ordered; the same node after the first user message moves
 * every later byte of the prefix, which is exactly the case the protocol
 * forbids.
 * @param types - durable event types in log order.
 * @returns the zero-based index of the offending `system/message`, or undefined.
 */
export function headInjectionAt(types: readonly string[]): number | undefined {
  let seenUser = false
  for (let index = 0; index < types.length; index += 1) {
    const type = types[index]
    if (type === 'user/message') {
      seenUser = true
    } else if (seenUser) {
      if (type === 'system/message') return index
    }
  }
  return undefined
}

/**
 * Read one Session's durable event types in log order.
 * @param agent - the agent whose Session is audited.
 * @returns every durable event type, oldest first.
 */
export function durableTypes(agent: Agent): string[] {
  const types: string[] = []
  for (let seq = 0; seq < agent.session.seq; seq += 1) {
    // oxlint-disable-next-line typescript/no-deprecated -- the audit needs the whole durable log in order
    const event = agent.session.eventAt(SessionSeq(seq))
    if (event !== undefined) types.push(event.type)
  }
  return types
}

/**
 * Register the protocol section and the pre-step audit for the lifetime of `ctx`.
 * @param ctx - plugin context; the section and the listener are disposed with it.
 * @param config - audit switches and the section order.
 * @throws when `sectionOrder` is not a non-negative number.
 */
export function apply(ctx: Context, config: Config = {}): void {
  if (config.enabled === false) return
  const order = config.sectionOrder ?? 9000
  if (!Number.isSafeInteger(order) || order < 0) {
    throw new TypeError(`aionui-linear: sectionOrder must be a non-negative safe integer, got ${String(order)}`)
  }
  const strict = config.strict ?? false
  const logger = ctx.logger('aionui-linear')
  ctx.effect(() => ctx.systemPrompt.section({
    name: 'AIONUI_LINEAR_PROTOCOL',
    order,
    text: LINEAR_PROTOCOL,
    interpolate: false,
  }), 'aionui-linear: protocol section')
  ctx.on('agent/pre-step', async (payload, next) => {
    const index = headInjectionAt(durableTypes(payload.agent))
    if (index !== undefined) {
      const message = `aionui-linear: system message at event ${index} follows user history; the request prefix moved and the provider cache will miss`
      if (strict) throw new Error(message)
      logger.warn(message)
    }
    return next()
  }, { prepend: true })
}
