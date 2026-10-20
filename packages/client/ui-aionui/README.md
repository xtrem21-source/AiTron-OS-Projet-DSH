---
description: "The AionUI shell for the Web client: the 21-assistant catalog, the parallel task board, and the preview tab that shows generated files beside the conversation."
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-aionui

English | [中文](README.zh.md)

## Summary

Adds an **AionUi** page to the sidebar: 21 professional assistants you can start a task from, and a task board listing every Session of the workspace with its live phase. A right-Sidebar tab type, **Preview**, lists the Session workspace files and renders the picked one.

## Use this package

Open **AionUi** in the sidebar. The **Assistants** view lists the shipped roster; opening a card offers its starter tasks and a task box, and **Start** creates a Session whose first user message is the assistant's role instruction followed by the task. The **Tasks** view lists every catalogued Session with its phase (running, waiting for you, new result, idle), and offers **Open**, **Stop and archive**, and **New task**.

The **Preview** tab opens from the right Sidebar's guide page. It shows the workspace root's files; picking one renders it: text and diffs as code, CSV/TSV as a table, HTML inside a sandboxed frame, images and PDF from their exact bytes.

## Understand the implementation

<details>
<summary>Implementation internals — click to expand</summary>

`src/client/index.ts` registers three things and nothing else: the injected face, the keyed `main` panel plus its `sidebar.panellist` entry, and the preview tab type with its body and chip title in the keyed `sidebar.right.pane.tab` seats. Assistant data is static (`catalog.ts`), taken from AionCore's published catalog, so the browser needs no Host service. The preview reads through `remote.workspaceFiles.list` / `read` / `readBytes`; one face per Session is cached so the body's effects keep stable callback identities. Object URLs are revoked when the selection changes and when the tab unmounts.

</details>

## Further Exploration

- [Right Sidebar](../../../docs/subsystems/sidebar-right.md)
- [Web Client Slots](../../../docs/subsystems/slots.md)
- [Agent presets](../ui-agent-preset/README.md)

## Model Experience

An assistant session's first user message is the catalog directive plus the task, so the role is part of the durable history and of the request prefix. Nothing here is model-visible afterwards.

#### Token effect

One user message per assistant task, roughly 40 tokens of directive.

#### KV Cache effect

None beyond the stable prefix: the directive is constant for a given assistant, so repeated turns keep the same prefix. The `dsh-aionui-linear` host plugin audits that prefix.

## Known Limitations and Deferred Work

- **The catalog is a shipped roster** — assistant definitions are compiled into the bundle; editing them needs a rebuild, and the AionCore skill bundles they reference are not installed.
- **Stop means stop and archive** — the task board stops a running Session through the Workspace archive action (`stopActivity: true`); a bare cancel without archiving is not exposed here.
- **Preview shows the workspace root** — nested directories are listed but not expanded; the file tree tab owns deep navigation.
- **HTML preview is script-free** — the sandboxed frame blocks scripts and same-origin access by design.
- **No failure state in the list row** — the Session list carries no failure field, so a failed run reads as idle; open the Session for its error.

## Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

None.

</details>
