# AiTron OS — DSH × AionUI

**A local agent workspace, in French, powered by DeepSeek Harness with AionUI's surfaces.**

[Français](README.fr.md) · [Fusion journal (FR)](JOURNAL-FUSION.md) · [Notice](NOTICE-AIONUI.md)

---

## What this is

One runnable product built from two projects:

| Part | Origin | Role |
|---|---|---|
| **Engine** | [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (Cordis, TypeScript) | durable sessions, tools, compaction, model providers, web UI |
| **Surfaces** | [AionUI](https://github.com/iOfficeAI/AionUi) (ideas, assistant catalog) | 21 professional assistants, parallel task board, preview panel |

The graft does not copy AionUI's Electron UI: it **reimplements its three surfaces** on DSH's native extension points (slots, right-sidebar tab types, sessions), so the fork stays maintainable against engine updates.

## Launching on Windows

**Simplest: double-click `Lancer-AiTron.cmd`** at the repository root.

The launcher checks Node.js and pnpm, moves `TEMP`/`TMP` to `K:\Reasonix-Temp-2`, installs dependencies on first run, builds on first run, then starts `dsh web` on `http://127.0.0.1:3080` and opens the browser.

An **AiTron OS** shortcut is already on the Desktop (product icon, working directory set).

| File | Behaviour |
|---|---|
| `Lancer-AiTron.cmd` | visible window: progress, install, build, then the server; closing it stops everything |
| `Lancer-AiTron-Silencieux.vbs` | no window; log in `K:\Reasonix-Temp-2\logs\web.log`; asks before replacing a running server |
| `Arreter-AiTron.cmd` | stops the server listening on port 3080, process tree included |

Silent start at logon: `wscript "K:\AiTron-OS-Projet-DSH\Lancer-AiTron-Silencieux.vbs" /silencieux`.

Manual alternative in PowerShell:

```powershell
cd K:\AiTron-OS-Projet-DSH
pnpm install
pnpm run build
pnpm dsh web
```
## What was added

| Package | Contribution |
|---|---|
| `packages/client/ui-aionui` | the **AionUi** page: 21-assistant catalog, parallel task board, **Preview** tab (images, PDF, sandboxed HTML, CSV, diffs) |
| `packages/client/locale-fr` | **French**: `fr` plus `common`, `conversation`, `settings*`, `sidebar`, `sidebarRight`, `workspace`, `trajectory`, `deliverables`, `subagent`, `pluginManager`, `schedule.manager`, `aionui` dictionaries |
| `packages/client/ui-voice-input` | **dictation** in the composer: browser recognizer, one utterance per session, stops on silence, typing, send, or second click |
| `packages/context/aionui-linear` | **linear protocol** for prefix caching: a static tail section plus a head-injection audit |

Assistant data comes from [AionCore](https://github.com/iOfficeAI/AionCore)'s public catalog (Apache-2.0); see [NOTICE-AIONUI.md](NOTICE-AIONUI.md).

## Quick start

Requirements: **Node.js** `^22.19 || >=24`, **pnpm** `11.28.5`.

```sh
pnpm install
pnpm run build
pnpm dsh web
```

The server listens on `http://127.0.0.1:3080` and opens the browser with a launch token. Use `pnpm dsh web --no-open` to skip the handoff.

## Choosing a model

- **DeepSeek**: `DEEPSEEK_API_KEY` (Settings → Models, or `~/.dsh/.credentials.yaml`).
- **Other providers** (NVIDIA, OpenAI-compatible gateways) through the `llm-pi-ai` router:

```yaml
# ~/.dsh/profiles/web/cordis.patch.yml
- id: llm-pi-ai
  name: "@deepseek-ai/dsh-llm-pi-ai"
  config:
    providers:
      nvidia:
        apiKeyEnv: NVIDIA_API_KEY
- id: agent-default-model
  config:
    provider: nvidia
    model: nvidia/nemotron-3-ultra-550b-a55b
```

## Language

**Settings → General → Language → Français.** It applies immediately and persists per browser. Keys that are not translated fall back to English, one key at a time.

## Dictation

The microphone sits on the right, inside the composer. It uses the browser's recognizer (`SpeechRecognition`) in the interface language.

| Behaviour | Detail |
|---|---|
| One utterance | the microphone stops itself at the first pause |
| Existing text kept | the draft is preserved and the transcript is appended |
| Keyboard wins | any key press or click outside the button stops it |
| Send | stops dictation immediately |
| Second click | stops and releases the microphone |

Limits: Chromium only; audio is handled by the browser's speech service, not locally; dictating over file or session chips replaces them.

## Checks

```sh
pnpm run typecheck      # 5 gates
pnpm run build          # 9 gates
pnpm run build:check    # 2 gates
pnpm exec tsx scripts/run-oxlint.ts packages/client/locale-fr packages/client/ui-voice-input packages/client/ui-aionui
```

## Change layout

```
packages/client/ui-aionui/        AionUi page + preview
packages/client/locale-fr/        French language pack
packages/client/ui-voice-input/   dictation
packages/context/aionui-linear/   linear protocol / cache
packages/bundle/web-app/          plugin roster and mounting
JOURNAL-FUSION.md                 dated trace of every session (FR)
```

## License

MIT, like the upstream repository. The assistant catalog taken from AionCore is Apache-2.0: see [NOTICE-AIONUI.md](NOTICE-AIONUI.md).

## Status

Developer preview: the AionUI surfaces are experimental, French coverage is broad but not exhaustive, and no cache figure is published until it has been measured against a real key.
