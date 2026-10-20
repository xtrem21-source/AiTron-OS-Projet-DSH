/**
 * Browser half: the composer's dictation button.
 *
 * One registration into the session-scoped `conversation.input.right` list. The
 * recognizer is the browser's own (Web Speech API); this plugin holds no audio,
 * sends nothing to a Host, and writes only through the session's `inputActions`
 * face, so the draft stays the single source of text.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import { startDictation, type DictationSession } from './dictation.ts'
import { speechRecognitionConstructor } from './speech.ts'
import { en, NS, zh, type VoiceInputKey } from './locales.ts'
import { VoiceButton, type DictationInjected } from './VoiceButton.tsx'

export type { DictationHandlers, DictationSession } from './dictation.ts'
export type { DictationInjected, VoiceButtonProps } from './VoiceButton.tsx'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Dictation button copy. */
    'voiceInput': VoiceInputKey
  }
}

/** Required browser services: slot registry, dictionaries, and the locale face. */
export const inject = ['slots', 'locale']

/**
 * Client plugin body: register the dictionaries and the composer button.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-voice-input: dictionaries')
  const face: DictationInjected = {
    supported: speechRecognitionConstructor() !== undefined,
    language: () => {
      const active = ctx.locale.getLocale().active
      if (active === 'fr') return 'fr-FR'
      if (active === 'zh') return 'zh-CN'
      return 'en-US'
    },
    start: (language, handlers): DictationSession | undefined => startDictation(language, handlers),
  }
  ctx.slots.inject('conversation.input.right', () => ctx.slots.register({
    name: 'conversation.input.right',
    id: 'voice-input',
    order: 10,
    locale: NS,
    inject: (): DictationInjected => face,
  }, VoiceButton))
}
