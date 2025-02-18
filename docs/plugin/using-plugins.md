# Using Plugins

All features in milkdown are provided by plugin.
Such as syntax, components, etc.
Now we can try more plugins:

```typescript
import { Editor } from "@milkdown/kit/core";
import { slash } from "@milkdown/kit/plugin/slash";
import { tooltip } from "@milkdown/kit/plugin/tooltip";
import { commonmark } from "@milkdown/kit/preset/commonmark";

Editor.make().use(commonmark).use(tooltip).use(slash).create();
```

---

## Toggling Plugins

You can also toggle plugins programmatically:

```typescript
import { Editor } from "@milkdown/kit/core";
import { someMilkdownPlugin } from "some-milkdown-plugin";

const editor = await Editor.config(configForPlugin)
  .use(someMilkdownPlugin)
  .create();

// remove plugin
await editor.remove(someMilkdownPlugin);

// remove config
editor.removeConfig(configForPlugin);

// add another plugin
editor.use(anotherMilkdownPlugin);

// Recreate the editor to apply changes.
await editor.create();
```

---

## Official Plugins

Milkdown provides the following official plugins:

### Plugins provided by `@milkdown/kit`:

> 🙋‍♀️Why not all plugins are available in `@milkdown/kit`?
>
> `@milkdown/kit` is a collection of plugins that are commonly used in the editor.
> If you want to use a plugin that is not in `@milkdown/kit`, you can install it separately.
> The plugins in `@milkdown/kit` are also stable and well-tested.

| Package Name                                                   | Description                                               |
| -------------------------------------------------------------- | --------------------------------------------------------- |
| [@milkdown/kit/preset/commonmark](/docs/api/preset-commonmark) | Add [commonmark](https://commonmark.org/) syntax support. |
| [@milkdown/kit/preset/gfm](/docs/api/preset-gfm)               | Add [gfm](https://github.github.com/gfm/) syntax support. |
| [@milkdown/kit/plugin/history](/docs/api/plugin-history)       | Add undo & redo support.                                  |
| [@milkdown/kit/plugin/clipboard](/docs/api/plugin-clipboard)   | Add markdown copy & paste support.                        |
| [@milkdown/kit/plugin/cursor](/docs/api/plugin-cursor)         | Add drop & gap cursor.                                    |
| [@milkdown/kit/plugin/listener](/docs/api/plugin-listener)     | Add listener support.                                     |
| [@milkdown/kit/plugin/indent](/docs/api/plugin-indent)         | Add tab indent support.                                   |
| [@milkdown/kit/plugin/upload](/docs/api/plugin-upload)         | Add drop and upload support.                              |
| [@milkdown/kit/plugin/block](/docs/api/plugin-block)           | Add a drag handle for every block node.                   |
| [@milkdown/kit/plugin/tooltip](/docs/api/plugin-tooltip)       | Add universal tooltip support.                            |
| [@milkdown/kit/plugin/slash](/docs/api/plugin-slash)           | Add universal slash commands support.                     |

### Other Plugins:

- [@milkdown/plugin-collab](/docs/api/plugin-collab)

  Add collaborative editing support, powered by [yjs](https://docs.yjs.dev/).

- [@milkdown/plugin-prism](/docs/api/plugin-prism)

  Add [prism](https://prismjs.com/) support for code block highlight.

- [@milkdown/plugin-emoji](/docs/api/plugin-emoji)

  Add emoji shortcut support (something like `:+1:`), and use [twemoji](https://twemoji.twitter.com/) to display emoji.

- [@milkdown/plugin-diagram](/docs/api/plugin-diagram)

  Add [mermaid](https://mermaid-js.github.io/mermaid/#/) diagram support.

## Community plugins

Check out [awesome-milkdown](https://github.com/Milkdown/awesome-milkdown) to find community plugins. You can also submit a PR to list your plugins there.
