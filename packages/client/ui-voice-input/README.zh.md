---
description: "Dictation button in the Web composer: the browser speech recognizer writes the transcript into the draft, in the active interface language."
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-voice-input

English | [中文](README.zh.md)

## Summary

Adds one microphone button to the conversation composer. It listens with the browser's own Web Speech recognizer, in the language the interface is set to, and writes the transcript into the draft through the session's input actions. Nothing is recorded or uploaded by this plugin.

## Use this package

Open a conversation and press the microphone next to the send control. The first press starts listening; recognized fragments replace the draft from the text that was already there, and the second press stops. Browsers without a speech recognizer show the button disabled with a tooltip.

Speech input is a Chromium feature (`SpeechRecognition` / `webkitSpeechRecognition`); Firefox has none, and Chrome's implementation sends audio to the browser vendor's speech service, not to the Host.

## Understand the implementation

<details>
<summary>Implementation internals — click to expand</summary>

`src/client/speech.ts` declares the structural slice of the Web Speech API this package needs and resolves the constructor at runtime. `src/client/dictation.ts` runs one session and routes `result`, `error`, and `end`. `VoiceButton` captures the draft when dictation starts, then writes `head + transcript` through `inputActions.setDraft`; an interim hypothesis never accumulates. The registration is one list entry in the session-scoped `conversation.input.right` seat.

</details>

## Further Exploration

- [Conversation](../../../docs/subsystems/conversation.md)
- [Web Client Slots](../../../docs/subsystems/slots.md)
- [Locale](../locale/README.md)

## Model Experience

None directly: dictation writes the same draft text a keyboard would, so the model sees ordinary user messages.

#### Token effect

None beyond the dictated text itself.

#### KV Cache effect

None.

## Known Limitations and Deferred Work

- **Chromium only** — the Web Speech API is absent elsewhere; the button stays disabled.
- **Audio leaves the machine** — the browser vendor's speech service transcribes it; this is not offline dictation.
- **Chips are dropped** — `setDraft` replaces the whole draft, so dictating over a draft that holds file or session references removes those chips.
- **No push-to-talk** — the button toggles; there is no key binding.

## Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

None.

</details>
