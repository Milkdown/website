# Getting Started

Milkdown is a lightweight but powerful WYSIWYG markdown editor. It consists of two parts:

-   A tiny core which provides a plugin loader and all kinds of internal plugins.
-   Lots of additional plugins provide syntax, commands and components.

With this pattern you can enable or disable any custom syntax and feature you like, such as table, latex and tooltip. You can also create your own plugin to support your awesome idea.

> 🍼 Fun fact: The Milkdown documentation is rendered by milkdown.

---

## Features

-  📝 **WYSIWYG Markdown** - Write markdown in an elegant way
-  🎨 **Themable** - Create your own theme and publish it as an npm package
-  🎮 **Hackable** - Create your own plugin to support your awesome idea
-  🦾 **Reliable** - Built on top of [prosemirror](https://prosemirror.net/) and [remark](https://github.com/remarkjs/remark)
-  ⚡ **Slash & Tooltip** - Write faster than ever, enabled by a plugin.
-  🧮 **Math** - LaTeX math equations support via math plugin
-  📊 **Table** - Table support with fluent ui, via table plugin
-  🍻 **Collaborate** - Shared editing support with [yjs](https://docs.yjs.dev/)
-  💾 **Clipboard** - Support copy and paste markdown, via clipboard plugin
-  👍 **Emoji** - Support emoji shortcut and picker, via emoji plugin

## Tech Stack

Milkdown is built on top of these libraries:

-   [Prosemirror](https://prosemirror.net/) and its community - A toolkit for building rich-text editors on the web
-   [Remark](https://github.com/remarkjs/remark) and its community - Markdown parser done right
-   [TypeScript](https://www.typescriptlang.org/) - Developed in TypeScript

---

## First editor

Here are some examples to help you get started with creating your first editor:

```typescript
import { Editor } from '@milkdown/core';
import { commonmark } from '@milkdown/preset-commonmark';

import { nord } from '@milkdown/theme-nord';
import '@milkdown/theme-nord/style.css';

Editor
  .make()
  .config(nord)
  .use(commonmark)
  .create();
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Milkdown/examples/tree/main/vanilla-commonmark)

## Taste the plugin

Now let's add **undo & redo** support to our editor using the `history` plugin:

```typescript

```typescript
import { Editor } from '@milkdown/core';
import { commonmark } from '@milkdown/preset-commonmark';
import { history } from '@milkdown/plugin-history';

import { nord } from '@milkdown/theme-nord';
import '@milkdown/theme-nord/style.css';

Editor
  .make()
  .config(nord)
  .use(commonmark)
  .use(history)
  .create();
```

> `<Mod>` is `<Cmd>` for mac and `<Ctrl>` for other platforms.

Now we can undo an edit by using `<Mod-z>` and redo it by using `<Mod-y>/<Shift-Mod-Z>`.
