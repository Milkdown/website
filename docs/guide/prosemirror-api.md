# ProseMirror API

Milkdown is built on top of [ProseMirror](https://prosemirror.net/). You can use the entire ProseMirror API in Milkdown.
To access the ProseMirror API, import from `@milkdown/kit/prose/*`. This ensures you are using the same version of ProseMirror as Milkdown and avoids duplicate module issues.

## Importing

To access a certain API in the `prosemirror-x` package, import it from `@milkdown/kit/prose/x`.

```ts
// Originally in prosemirror-state
import { EditorState } from '@milkdown/kit/prose/state'
// Originally in prosemirror-view
import { EditorView } from '@milkdown/kit/prose/view'
// Originally in prosemirror-model
import { Schema, Node } from '@milkdown/kit/prose/model'
```

> **Important**: Always import ProseMirror modules from `@milkdown/kit/prose/*` rather than directly from `prosemirror-*` packages. Using separate ProseMirror installations can cause subtle bugs due to duplicate instances of the same module.

## Common Use Cases

### Accessing the Editor View

You can access the ProseMirror `EditorView` through Milkdown's context system:

```ts
import { editorViewCtx } from '@milkdown/kit/core'

// Inside an action or after editor creation
editor.action((ctx) => {
  const view = ctx.get(editorViewCtx)
  // Now you can use the ProseMirror EditorView API
  console.log(view.state.doc.textContent)
})
```

### Creating Custom Input Rules

```ts
import { InputRule } from '@milkdown/kit/prose/inputrules'
import { $inputRule } from '@milkdown/kit/utils'

const myRule = $inputRule(
  () =>
    new InputRule(/pattern/, (state, match, start, end) => {
      return state.tr.delete(start, end)
    })
)
```

### Working with Transactions

```ts
editor.action((ctx) => {
  const view = ctx.get(editorViewCtx)
  const { tr } = view.state
  // Apply transformations
  view.dispatch(tr.insertText('Hello'))
})
```

## List of Packages

The following ProseMirror packages are re-exported:

| Import Path                       | Original Package          | Description                         |
| --------------------------------- | ------------------------- | ----------------------------------- |
| `@milkdown/kit/prose/changeset`   | `prosemirror-changeset`   | Change tracking                     |
| `@milkdown/kit/prose/commands`    | `prosemirror-commands`    | Built-in editor commands            |
| `@milkdown/kit/prose/dropcursor`  | `prosemirror-dropcursor`  | Drop cursor indicator               |
| `@milkdown/kit/prose/gapcursor`   | `prosemirror-gapcursor`   | Gap cursor for block boundaries     |
| `@milkdown/kit/prose/history`     | `prosemirror-history`     | Undo/redo history                   |
| `@milkdown/kit/prose/inputrules`  | `prosemirror-inputrules`  | Input rule matching                 |
| `@milkdown/kit/prose/keymap`      | `prosemirror-keymap`      | Key binding support                 |
| `@milkdown/kit/prose/model`       | `prosemirror-model`       | Document model (Schema, Node, Mark) |
| `@milkdown/kit/prose/schema-list` | `prosemirror-schema-list` | List-related schema helpers         |
| `@milkdown/kit/prose/state`       | `prosemirror-state`       | Editor state management             |
| `@milkdown/kit/prose/transform`   | `prosemirror-transform`   | Document transformations            |
| `@milkdown/kit/prose/view`        | `prosemirror-view`        | Editor view and DOM rendering       |
| `@milkdown/kit/prose/tables`      | `prosemirror-tables`      | Table editing support               |

You can find the full ProseMirror documentation [here](https://prosemirror.net/docs/ref/).
