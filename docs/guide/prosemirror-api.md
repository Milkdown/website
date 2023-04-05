# Prosemirror API

Milkdown is built on top of prosemirror. Which means you can use all the prosemirror API in Milkdown.
To access the prosemirror API, you can use the `@milkdown/prose` package. It re-exports all the prosemirror API.
Using this package can make sure that you are using the same version of prosemirror as Milkdown.

## Installation

```bash
npm install @milkdown/prose
```

To access certain API in `prosemirror-x` package, you need to import them from `@milkdown/prose/x`.

For example:

```ts
// Originally in prosemirror-state
import { EditorState } from '@milkdown/prose/state';

// Originally in prosemirror-view
import { EditorView } from '@milkdown/prose/view';
```

## List of packages

The following is a list of all the re-exported prosemirror API.

- `@milkdown/prose/changeset`
- `@milkdown/prose/commands`
- `@milkdown/prose/dropcursor`
- `@milkdown/prose/gapcursor`
- `@milkdown/prose/history`
- `@milkdown/prose/inputrules`
- `@milkdown/prose/keymap`
- `@milkdown/prose/model`
- `@milkdown/prose/schema-list`
- `@milkdown/prose/state`
- `@milkdown/prose/transform`
- `@milkdown/prose/view`
- `@milkdown/prose/tables`

You can find the documentation of the prosemirror API [here](https://prosemirror.net/docs/ref/).
