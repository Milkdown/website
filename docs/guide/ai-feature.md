# AI Feature

Crepe 7.21 ships a first-class AI editing experience as an opt-in feature of the Crepe editor. It bundles a toolbar entry, an instruction palette with built-in suggestions, an inline streaming indicator, and a diff accept/reject panel — all wired up behind a single `provider` callback that yields markdown tokens.

## Overview

---

- 🤖 **Bring your own provider**: any `AsyncIterable<string>` of markdown chunks works.
- 🔌 **Built-in providers**: factory functions for OpenAI Chat Completions and the Anthropic Messages API.
- ✨ **Instruction palette**: search box, free-text prompts, and pre-populated suggestions (Improve writing, Fix grammar, Make shorter / longer, Change tone, Translate).
- 🌊 **Live streaming**: output is committed in real time with an inline status pill.
- 🔍 **Diff review**: when streaming ends, users can accept, reject, or retry each changed block.
- 🚫 **Disabled by default**: the AI feature is opt-in — you must enable `CrepeFeature.AI` and provide a `provider`.

The feature lives in `@milkdown/crepe/feature/ai`. Under the hood it composes the lower-level `@milkdown/plugin-streaming` and `@milkdown/plugin-diff` plugins, so manual streaming or diff-only setups remain possible without enabling AI.

## Quick Start with a Built-in Provider

---

### OpenAI

Use `createOpenAIProvider` to talk to any OpenAI-compatible Chat Completions endpoint.

```typescript
import { Crepe, CrepeFeature } from '@milkdown/crepe'
import { createOpenAIProvider } from '@milkdown/crepe/llm-providers/openai'
import '@milkdown/crepe/theme/common/style.css'
import '@milkdown/crepe/theme/frame.css'

const crepe = new Crepe({
  root: '#app',
  features: {
    [CrepeFeature.AI]: true,
  },
  featureConfigs: {
    [CrepeFeature.AI]: {
      provider: createOpenAIProvider({
        // Route through your backend so the key never reaches the browser.
        baseURL: 'https://your-app.example.com/openai-proxy',
        model: 'gpt-4o-mini',
      }),
    },
  },
})

await crepe.create()
```

By default the provider hits `https://api.openai.com/v1/chat/completions` with `stream: true`. Override `baseURL` to point at your own proxy, or pass extra headers via `headers` (e.g. session tokens). You can also forward additional request fields through `body`:

```typescript
createOpenAIProvider({
  model: 'gpt-4o-mini',
  baseURL: 'https://your-app.example.com/openai-proxy',
  body: { temperature: 0.4, top_p: 0.95 },
})
```

### Anthropic

`createAnthropicProvider` calls Anthropic's `/v1/messages` streaming endpoint. Anthropic requires `max_tokens`, so the factory defaults it to `4096`:

```typescript
import { createAnthropicProvider } from '@milkdown/crepe/llm-providers/anthropic'

const provider = createAnthropicProvider({
  baseURL: 'https://your-app.example.com/anthropic-proxy',
  model: 'claude-sonnet-4-5',
  maxTokens: 4096,
  // anthropicVersion defaults to '2023-06-01'.
})
```

Both factories share a small common config (`apiKey`, `baseURL`, `headers`, `model`, `systemPrompt`, `dangerouslyAllowBrowser`) plus a few provider-specific knobs. See the [Crepe API reference](/docs/api/crepe) for the full type definitions.

## UI Surfaces

---

### Toolbar button

The AI button appears in the selection toolbar's function group whenever a `provider` is configured. Clicking it opens the instruction palette. The icon is overridable at the feature level via `aiIcon`, or per-toolbar via the Toolbar feature's own `aiIcon`.

### Instruction palette

The palette is the main entry point. It contains:

- A search/filter input — placeholder configurable via `instructionPlaceholder`.
- A **Suggestions** section with the built-in items.
- A **Send as prompt** entry for free-text instructions ("Ask AI: …").
- A round submit button (its accessible name is set via `submitButtonLabel`).

The built-in suggestions include:

- **Improve writing** — preserves the original meaning.
- **Fix grammar & spelling**.
- **Make shorter** / **Make longer**.
- **Change tone…** submenu — Professional, Casual, Confident, Friendly, Direct, Formal.
- **Translate…** submenu — English, Chinese (Simplified), Japanese, Korean, Spanish, French, German.

Every label exposed in the palette is configurable: `suggestionsHeaderLabel`, `sendAsPromptHeaderLabel`, `sendAsPromptLabel`, `listboxLabel`. Icons can be swapped via `sendIcon`, `sendPromptIcon`, `enterKeyIcon`, `chevronLeftIcon`, `chevronRightIcon`.

### Streaming indicator

While the provider is yielding chunks, an inline pill is rendered at the insertion point. It shows:

- A small spinner.
- An active-form label such as **Improving writing** or **Translating to Japanese**. When `runAICmd` is invoked without a `label`, the indicator falls back to `streamingIndicator.fallbackLabel` (default `"Generating"`).
- A keyboard hint `streamingIndicator.cancelHint` (default `"Esc to cancel"`).

### Diff actions panel

When streaming ends with `diffReviewOnEnd: true` (the default), the editor enters diff review and a floating panel pins to the bottom of the editor with three actions:

- **Retry** — re-runs the same instruction on the original text range.
- **Reject all** — discards every pending diff block.
- **Accept all** — applies every pending diff block. Also bound to <kbd>Mod</kbd>+<kbd>Enter</kbd>.

All three labels and icons are configurable via `diffActions`:

```typescript
{
  diffActions: {
    retryLabel: 'Try again',
    rejectAllLabel: 'Discard',
    acceptAllLabel: 'Apply all',
    modSymbol: 'Ctrl', // override the auto-detected ⌘ glyph
  },
}
```

The panel is only shown for diffs created by AI sessions, so it does not appear when the diff plugin is started manually via `startDiffReviewCmd`.

## Customizing Suggestions

---

Pass `buildAISuggestions` to mutate the suggestion list. The builder is pre-populated with the defaults, so you can add to, remove, or replace any of them — or call `builder.clear()` first and rebuild from scratch.

```typescript
import type { AISuggestionsBuilder } from '@milkdown/crepe/feature/ai'

const config = {
  provider: /* … */,
  buildAISuggestions: (builder: AISuggestionsBuilder) => {
    // Remove a default item by id.
    builder.removeItem('grammar')

    // Add a custom item.
    builder.addItem('summarize', {
      icon: '<svg viewBox="0 0 24 24">…</svg>',
      label: 'Summarize',
      streamingLabel: 'Summarizing',
      prompt: 'Summarize this in one short paragraph.',
    })

    // Mutate an existing submenu (Translate / Tone).
    builder.getSubmenu('translate')?.addItem('portuguese', {
      icon: '<svg viewBox="0 0 24 24">…</svg>',
      label: 'Portuguese',
      streamingLabel: 'Translating to Portuguese',
      prompt: 'Translate this to Portuguese.',
    })
  },
}
```

The `AISuggestionItem` shape is `{ icon, label, streamingLabel?, prompt }`. `prompt` is what gets sent to the provider as the user instruction; `streamingLabel` is the active-form text shown in the streaming indicator while that suggestion runs.

To add a brand-new submenu:

```typescript
builder.addSubmenu(
  'rewrite',
  {
    icon: '<svg viewBox="0 0 24 24">…</svg>',
    label: 'Rewrite as…',
    title: 'Rewrite',
    searchPlaceholder: 'Search formats…',
  },
  (sub) => {
    sub
      .addItem('headline', {
        icon: '<svg viewBox="0 0 24 24">…</svg>',
        label: 'Headline',
        streamingLabel: 'Rewriting as headline',
        prompt: 'Rewrite this as a punchy headline.',
      })
      .addItem('bullets', {
        icon: '<svg viewBox="0 0 24 24">…</svg>',
        label: 'Bullet list',
        streamingLabel: 'Converting to bullets',
        prompt: 'Rewrite this as a bullet list of key points.',
      })
  }
)
```

## Building a Custom Provider

---

A provider is just an async generator that yields markdown chunks:

```typescript
import type { AIProvider } from '@milkdown/crepe/feature/ai'

const customProvider: AIProvider = async function* (context, signal) {
  const response = await fetch('/api/ai', {
    method: 'POST',
    body: JSON.stringify(context),
    signal, // forward the abort signal so cancellation works
  })
  if (!response.ok || !response.body) throw new Error('AI request failed')

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  while (true) {
    const { done, value } = await reader.read()
    if (done || signal.aborted) return
    yield decoder.decode(value, { stream: true })
  }
}
```

The provider is called with two arguments:

- `context: AIPromptContext` — `{ document, selection, instruction }`, all serialized as markdown. `selection` is empty when the user has no text selected (the AI is generating, not rewriting).
- `signal: AbortSignal` — fires when the user clicks **Cancel** or hits <kbd>Esc</kbd>. Always forward it to `fetch` and stop yielding once it aborts.

Yield raw markdown — the streaming plugin parses chunks back into ProseMirror nodes. Do **not** wrap output in fenced code blocks (the built-in providers' default system prompt already enforces this).

If you need to send something other than the full document (e.g. only the surrounding paragraph, or a project-scoped context window), override `buildContext`:

```typescript
import type { AIFeatureConfig } from '@milkdown/crepe/feature/ai'

const config: AIFeatureConfig = {
  provider: customProvider,
  buildContext: (ctx, instruction) => ({
    document: shortenedDocument(ctx),
    selection: currentSelectionMarkdown(ctx),
    instruction,
  }),
}
```

## Streaming and Diff Review Flow

---

The AI feature wires together the streaming and diff plugins so most users never need to touch them directly. The high-level flow:

1. **Trigger** — the user picks a suggestion or types a prompt. The toolbar dispatches `runAICmd({ instruction, label })`.
2. **Insertion mode auto-selected** — if the selection is non-empty, streamed output replaces it; otherwise it is inserted at the cursor.
3. **Stream** — each chunk yielded by the provider is committed live, with diff markers tracking what changed.
4. **End** — when the generator returns, the streaming plugin hands off to diff review (controlled by `diffReviewOnEnd`, default `true`).
5. **Review** — the user accepts, rejects, or retries each block from the floating diff actions panel.

Set `diffReviewOnEnd: false` if you want streamed output to be committed without an explicit review step — useful for high-trust workflows where the AI is acting as a typing aid rather than as an editor.

You can also drive the feature programmatically:

```typescript
import { callCommand } from '@milkdown/kit/utils'
import { runAICmd, abortAICmd } from '@milkdown/crepe/feature/ai'

// Start a session.
crepe.editor.action(
  callCommand(runAICmd.key, {
    instruction: 'Summarize this in two sentences.',
    label: 'Summarizing',
  })
)

// Cancel it.
crepe.editor.action(callCommand(abortAICmd.key, { keep: true }))
```

`runAICmd` returns `false` if there is no provider, an AI session is already running, or streaming/diff review is already active. `abortAICmd`'s `keep` option mirrors the streaming plugin: `true` leaves the already-streamed text in place, `false` rolls it back.

## Error Handling

---

Provide an `onError` callback to surface failures. The feature emits two error codes:

- `aiProviderError` — the provider threw or the upstream API returned a non-2xx status.
- `aiBuildContextError` — `buildContext` threw while assembling the prompt.

```typescript
import type { MilkdownError } from '@milkdown/kit/exception'

const config = {
  provider: /* … */,
  onError: (error: MilkdownError) => {
    if (error.code === 'aiProviderError') {
      toast.error('AI request failed. Please try again.')
    } else {
      toast.error('Could not assemble the prompt context.')
    }
    console.error(error)
  },
}
```

When the provider throws, the streaming indicator is cleared and any partial output rolled back, so the document is left in a consistent state.

## Browser Safety

---

Both built-in providers refuse to send an `apiKey` directly from the browser by default. The recommended pattern is to deploy a thin server proxy and point `baseURL` at it, letting the proxy inject the secret server-side:

```typescript
createOpenAIProvider({
  baseURL: 'https://your-app.example.com/openai-proxy',
  model: 'gpt-4o-mini',
  // no apiKey — the proxy adds Authorization itself
  headers: { 'x-session-token': sessionToken },
})
```

If you really need direct browser → provider calls (desktop apps, internal tools, or BYOK setups where each user supplies their own key), opt in explicitly:

```typescript
createOpenAIProvider({
  apiKey: userSuppliedKey,
  model: 'gpt-4o-mini',
  dangerouslyAllowBrowser: true,
})
```

Setting `dangerouslyAllowBrowser: true` is an explicit acknowledgement that the API key will be visible to anyone inspecting network traffic. Do not enable it for end-user web apps where keys are shared across users.

## API Reference

---

- [Crepe API reference](/docs/api/crepe) — the full `AIFeatureConfig` interface, all label and icon options, and provider config shapes.
- [`@milkdown/plugin-streaming`](/docs/api/plugin-streaming) — lower-level streaming commands (`startStreamingCmd`, `pushChunkCmd`, `endStreamingCmd`, `abortStreamingCmd`) used by `CrepeFeature.AI` under the hood.
- [`@milkdown/plugin-diff`](/docs/api/plugin-diff) — lower-level diff commands (`startDiffReviewCmd`, `acceptDiffChunkCmd`, `rejectDiffChunkCmd`) used by the diff review step.
