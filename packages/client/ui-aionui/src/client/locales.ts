/** `aionui` namespace dictionaries. */

/** Dictionary namespace owned by this plugin. */
export const NS = 'aionui'

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'panel': 'AionUi',
  'tabs.assistants': '助手',
  'tabs.tasks': '任务',
  'assistants.title': '21 位专业助手',
  'assistants.subtitle': '选择一位助手开始任务，或在卡片下方输入自己的任务。',
  'assistants.taskLabel': '任务',
  'assistants.taskPlaceholder': '描述你要完成的任务',
  'assistants.start': '开始',
  'assistants.cancel': '取消',
  'assistants.starters': '示例任务',
  'tasks.title': '并行任务',
  'tasks.subtitle': '同一工作区中并行的会话，实时状态。',
  'tasks.empty': '还没有会话。',
  'tasks.open': '打开',
  'tasks.stop': '停止并归档',
  'tasks.stopConfirm': '再次点击确认停止',
  'tasks.running': '运行中',
  'tasks.waiting': '等待输入',
  'tasks.idle': '空闲',
  'tasks.unread': '有新结果',
  'tasks.new': '新建任务',
  'tasks.blank': '空白会话',
  'tasks.updated': '更新于 {time}',
  'tasks.stopFailed': '停止失败：{message}',
  'preview.title': '预览',
  'preview.guide': '文件预览',
  'preview.guideDescription': '在对话旁查看生成的图片、HTML、CSV、PDF 和代码差异。',
  'preview.refresh': '刷新',
  'preview.empty': '此工作区还没有文件。',
  'preview.loading': '正在加载…',
  'preview.noWorkspace': '此会话没有工作目录。',
  'preview.select': '选择一个文件以预览。',
  'preview.unavailable': '无法预览此文件：{message}',
  'preview.binary': '二进制文件，无法以文本预览。',
  'preview.truncated': '仅显示前 {lines} 行。',
  'preview.files': '文件',
} as const

/** English dictionary, key-identical to the Chinese source of truth. */
export const en: Record<AionuiKey, string> = {
  'panel': 'AionUi',
  'tabs.assistants': 'Assistants',
  'tabs.tasks': 'Tasks',
  'assistants.title': '21 professional assistants',
  'assistants.subtitle': 'Pick an assistant, or write your own task under the card.',
  'assistants.taskLabel': 'Task',
  'assistants.taskPlaceholder': 'Describe the task',
  'assistants.start': 'Start',
  'assistants.cancel': 'Cancel',
  'assistants.starters': 'Starter tasks',
  'tasks.title': 'Parallel tasks',
  'tasks.subtitle': 'Sessions running side by side in this workspace, with live status.',
  'tasks.empty': 'No session yet.',
  'tasks.open': 'Open',
  'tasks.stop': 'Stop and archive',
  'tasks.stopConfirm': 'Click again to stop',
  'tasks.running': 'Running',
  'tasks.waiting': 'Waiting for you',
  'tasks.idle': 'Idle',
  'tasks.unread': 'New result',
  'tasks.new': 'New task',
  'tasks.blank': 'Blank session',
  'tasks.updated': 'Updated {time}',
  'tasks.stopFailed': 'Stop failed: {message}',
  'preview.title': 'Preview',
  'preview.guide': 'File preview',
  'preview.guideDescription': 'See generated images, HTML, CSV, PDF and code diffs beside the conversation.',
  'preview.refresh': 'Refresh',
  'preview.empty': 'This workspace has no file yet.',
  'preview.loading': 'Loading…',
  'preview.noWorkspace': 'This session has no working directory.',
  'preview.select': 'Select a file to preview.',
  'preview.unavailable': 'Cannot preview this file: {message}',
  'preview.binary': 'Binary file; no text preview.',
  'preview.truncated': 'Showing the first {lines} lines.',
  'preview.files': 'Files',
}

/** Key domain of the `aionui` namespace (zh is the source of truth). */
export type AionuiKey = keyof typeof zh

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** AionUI workspace copy. */
    'aionui': AionuiKey
  }
}
