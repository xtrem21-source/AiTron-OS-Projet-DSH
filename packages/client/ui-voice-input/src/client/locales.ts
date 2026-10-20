/** `voiceInput` namespace dictionaries. */

/** Dictionary namespace owned by this plugin. */
export const NS = 'voiceInput'

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'start': '语音输入',
  'stop': '停止语音输入',
  'listening': '正在聆听…',
  'unsupported': '此浏览器不支持语音输入',
  'failed': '语音输入中断：{code}',
} as const

/** English dictionary, key-identical to the Chinese source of truth. */
export const en: Record<VoiceInputKey, string> = {
  'start': 'Dictate',
  'stop': 'Stop dictation',
  'listening': 'Listening…',
  'unsupported': 'This browser has no speech input',
  'failed': 'Dictation stopped: {code}',
}

/** Key domain of the `voiceInput` namespace (zh is the source of truth). */
export type VoiceInputKey = keyof typeof zh

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Dictation button copy. */
    'voiceInput': VoiceInputKey
  }
}
