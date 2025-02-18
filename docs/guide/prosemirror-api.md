# Prosemirror API

Milkdown is built on top of prosemirror. Which means you can use the entire prosemirror API in Milkdown.
To access the prosemirror API, you can use the `@milkdown/prose` package. It re-exports all of the prosemirror API.
Using this package you can make sure that you are using the same version of prosemirror as Milkdown.

## Installation

To access a certain API in the `prosemirror-x` package, you need to import them from `@milkdown/kit/prose/x`.

For example:

```ts
// Originally in prosemirror-state
import { EditorState } from "@milkdown/kit/prose/state";
// Originally in prosemirror-view
import { EditorView } from "@milkdown/kit/prose/view";
```

## List of packages

The following is a list of all the re-exported prosemirror API.

- `@milkdown/kit/prose/changeset`
- `@milkdown/kit/prose/commands`
- `@milkdown/kit/prose/dropcursor`
- `@milkdown/kit/prose/gapcursor`
- `@milkdown/kit/prose/history`
- `@milkdown/kit/prose/inputrules`
- `@milkdown/kit/prose/keymap`
- `@milkdown/kit/prose/model`
- `@milkdown/kit/prose/schema-list`
- `@milkdown/kit/prose/state`
- `@milkdown/kit/prose/transform`
- `@milkdown/kit/prose/view`
- `@milkdown/kit/prose/tables`

You can find the documentation of the prosemirror API [here](https://prosemirror.net/docs/ref/).
