---
description: "Cache-stable linear prompt protocol for the AionUI shell: one static tail section plus a per-step audit of head injections."
kind: "package-reference"
---

# @deepseek-ai/dsh-aionui-linear

English | [中文](README.zh.md)

## Summary

Mounts the AionUI linear protocol: a constant section at the tail of the system prompt, and a pre-step audit that reports any `system/message` appended after user history — the one shape that moves the request prefix and turns a DeepSeek cache hit into a miss.

## Use this package

The `web` bundle mounts it process-wide:

```yaml
- id: aionui-linear
  name: '@deepseek-ai/dsh-aionui-linear'
  config:
    strict: false
```

`strict: true` refuses the step with the offending event index instead of logging a warning. `sectionOrder` moves the protocol section; keep it above every persona and harness section.

## Understand the implementation

<details>
<summary>Implementation internals — click to expand</summary>

`apply` registers `ctx.systemPrompt.section` with `interpolate: false`, so the text can never pick up a variable, and a prepended `agent/pre-step` listener that reads the Session's durable event types (`agent.session.seq` / `eventAt`) and runs `headInjectionAt`. Nothing is written: the audit observes history and never rewrites it, because a rewrite is what it exists to prevent.

</details>

## Further Exploration

- [System prompt](../../../docs/subsystems/system-prompt.md)
- [Agent loop](../../core/agent-loop/README.md)
- [Turn flow](../../../docs/architecture.md#turn-flow)

## Model Experience

#### What the model sees

One constant paragraph at the end of the system prompt, identical on every request of every Session.

#### Token effect

Roughly 45 tokens, once per request, inside the cached prefix.

#### KV Cache effect

Protective. The section is static and non-interpolated, so it cannot move the prefix; the audit reports the one event class that can.

## Known Limitations and Deferred Work

- **The audit watches history, not the wire** — a provider-side eviction is invisible here; the per-step `usage.cacheReadTokens` remains the production signal.
- **`strict` refuses the turn** — a legitimately appended system node (for example a plugin that consolidates a prompt after user history) fails the step instead of being reordered.
- **No projection** — violations go to the plugin logger; the Web UI reads cache hits from the existing `tokenUsage` projection.

## Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

None.

</details>
