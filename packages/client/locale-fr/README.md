---
description: "French language pack for the Web GUI: registers fr with an English fallback and translates the shell, the conversation composer, and the AionUI surfaces."
kind: "package-reference"
---

# @deepseek-ai/dsh-client-locale-fr

English | [中文](README.zh.md)

## Summary

Adds **Français** to the language selector and translates the shell copy, the conversation composer, the AionUI page, and the dictation button. Any namespace or key this pack does not cover falls back to English, key by key.

## Use this package

Open **Settings → General → Language** and pick **Français**. The switch applies immediately and persists per browser as `locale.preference`. A browser whose preferred language is French selects it on first visit.

## Understand the implementation

<details>
<summary>Implementation internals — click to expand</summary>

`apply` registers `fr` through `locale.addLanguage({ id, label, fallback: 'en' })` — the locale contract requires an already-registered fallback and a chain that terminates at English — then registers one dictionary per namespace (`common`, `conversation`, `aionui`, `voiceInput`). Lookup walks the fallback chain inside the namespace, so a partial dictionary is legal: an uncovered key reads in English rather than showing its key. Dictionaries live in `src/client/dictionaries.ts`; adding a namespace is one entry in `NAMESPACES`.

</details>

## Further Exploration

- [Locale](../locale/README.md)
- [AionUI shell](../ui-aionui/README.md)
- [Dictation](../ui-voice-input/README.md)

## Model Experience

#### What the model sees

Nothing: dictionaries are interface copy and never enter a request.

#### Token effect

None.

#### KV Cache effect

None.

## Known Limitations and Deferred Work

- **Partial coverage** — the conversation namespace is translated for the composer and the chat shell (~80 keys of ~370); tool-detail and trajectory vocabulary stays English.
- **No plural rules** — every string is a single form; the runtime does not select plural categories for `fr`.
- **No date or number locales** — formatters still use the browser locale, not the interface language.
- **Voice stays English elsewhere** — the dictation language follows `fr`/`zh`/default only.

## Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

None.

</details>
