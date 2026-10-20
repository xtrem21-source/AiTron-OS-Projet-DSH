/**
 * Browser half: the French language pack.
 *
 * Registers `fr` with an English fallback — the locale contract requires the
 * chain to reach `en` — then the namespaces this pack translates. A namespace
 * or key left out reads in English; the settings selector lists Français as
 * soon as the definition registers, and the choice persists per browser.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type { LocaleDict } from '@deepseek-ai/dsh-client-locale/client'
import { frAionui, frCommon, frConversation, frVoiceInput } from './dictionaries.ts'
import {
  frDeliverables, frPluginManager, frScheduleManager, frSettings, frSettingsAgentPreset,
  frChat, frModel, frPermissionAccess, frSettingsAccount, frSettingsLocale, frSettingsLocaleRow,
  frSettingsModels, frSettingsPermission,
  frSettingsPlugins, frSettingsSessionLog, frSettingsTheme, frShortcuts, frSidebar, frSidebarRight,
  frSubagent, frTrajectory, frWorkspace,
} from './dictionaries-shell.ts'

export { frAionui, frCommon, frConversation, frVoiceInput } from './dictionaries.ts'
export { frDeliverables, frSettings, frSubagent, frTrajectory } from './dictionaries-shell.ts'

/** Required browser service: the locale runtime. */
export const inject = ['locale']

/** Namespaces this pack translates, with their dictionaries. */
const NAMESPACES: readonly (readonly [string, LocaleDict])[] = [
  ['common', frCommon],
  ['conversation', frConversation],
  ['aionui', frAionui],
  ['voiceInput', frVoiceInput],
  ['settings', frSettings],
  ['trajectory', frTrajectory],
  ['deliverables', frDeliverables],
  ['subagent', frSubagent],
  ['locale', frSettingsLocale],
  ['settings.locale', frSettingsLocaleRow],
  ['settings.permission', frSettingsPermission],
  ['settings.sessionLog', frSettingsSessionLog],
  ['chat', frChat],
  ['settings.account', frSettingsAccount],
  ['model', frModel],
  ['permission.access', frPermissionAccess],
  ['shortcuts', frShortcuts],
  ['settings.theme', frSettingsTheme],
  ['settings.plugins', frSettingsPlugins],
  ['settings.agentPreset', frSettingsAgentPreset],
  ['settings.models', frSettingsModels],
  ['pluginManager', frPluginManager],
  ['schedule.manager', frScheduleManager],
  ['sidebar', frSidebar],
  ['sidebarRight', frSidebarRight],
  ['workspace', frWorkspace],
]

/**
 * Client plugin body: register the language, then its dictionaries.
 * @param ctx - client root context carrying the locale runtime.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(
    () => ctx.locale.addLanguage({ id: 'fr', label: 'Français', fallback: 'en' }),
    'locale-fr: language',
  )
  for (const [namespace, dictionary] of NAMESPACES) {
    ctx.effect(
      () => ctx.locale.register(namespace, 'fr', dictionary),
      `locale-fr: ${namespace} dictionary`,
    )
  }
}
