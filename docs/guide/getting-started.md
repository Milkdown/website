# Getting Started with Milkdown

Milkdown is a powerful WYSIWYG markdown editor that combines the simplicity of markdown with the flexibility of a modern editor. It's designed to be lightweight yet extensible, making it perfect for both simple and complex editing needs.

## Quick Start

The fastest way to get started is using `@milkdown/crepe`:

```bash
npm install @milkdown/crepe
```

```typescript
import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";

const crepe = new Crepe({
  root: '#app',
  defaultValue: "Hello, Milkdown!",
});

crepe.create();
```

::iframe{src="https://stackblitz.com/github/Milkdown/examples/tree/main/editor-crepe"}

## Core Concepts

Milkdown consists of two main parts:

1. **Core Package** (`@milkdown/core`)
   - Plugin loader
   - Internal plugins

2. **Additional Plugins**
   - Syntax support
   - Commands
   - UI components
   - Custom features

This modular architecture allows you to enable or disable features as needed, from basic markdown support to advanced features like tables, LaTeX equations, and collaborative editing.

## Key Features

- 📝 **WYSIWYG Markdown** - Write markdown in an elegant way
- 🎨 **Themable** - Create your own theme and publish it as an npm package
- 🎮 **Hackable** - Create your own plugin to support your awesome idea
- 🦾 **Reliable** - Built on top of [prosemirror](https://prosemirror.net/) and [remark](https://github.com/remarkjs/remark)
- ⚡ **Slash & Tooltip** - Write faster than ever, enabled by a plugin
- 🧮 **Math** - LaTeX math equations support via math plugin
- 📊 **Table** - Table support with fluent ui, via table plugin
- 🍻 **Collaborate** - Shared editing support with [yjs](https://docs.yjs.dev/)
- 💾 **Clipboard** - Support copy and paste markdown, via clipboard plugin
- 👍 **Emoji** - Support emoji shortcut and picker, via emoji plugin

## Tech Stack

Milkdown is built on top of these powerful libraries:

- [Prosemirror](https://prosemirror.net/) - A toolkit for building rich-text editors on the web
- [Remark](https://github.com/remarkjs/remark) - Markdown parser done right
- [TypeScript](https://www.typescriptlang.org/) - For type safety and better developer experience

## Creating Your First Editor

Milkdown provides two distinct approaches to create an editor, each suited for different needs:

### 1. 🍼 Using `@milkdown/kit` (Build from Scratch)

This approach gives you complete control over your editor. Use this if you want to:
- Build a custom editor from the ground up
- Have full control over which features to include
- Create a highly customized editing experience
- Integrate with specific frameworks or requirements

First, install the required packages:

```bash
npm install @milkdown/kit
```

Create a basic editor with commonmark syntax:

```typescript
import { Editor } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";

// This is the must have css for prosemirror
import "@milkdown/kit/prose/view/style/prosemirror.css";

Editor
  .make()
  .use(commonmark)
  .create();
```

::iframe{src="https://stackblitz.com/github/Milkdown/examples/tree/main/vanilla-commonmark"}

Add undo & redo support:

```typescript
import { Editor } from "@milkdown/kit/core";
import { history } from "@milkdown/kit/plugin/history";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { nord } from "@milkdown/theme-nord";
import "@milkdown/theme-nord/style.css";

const milkdown = Editor
  .make()
  .config(nord)
  .use(commonmark)
  .use(history)
  .create()
  .then(() => {
    console.log("Editor created");
  });

// To destroy the editor
milkdown.destroy();
```

> **Note**: `<Mod>` is `<Cmd>` for macOS and `<Ctrl>` for other platforms.

### 2. 🥞 Using `@milkdown/crepe` (Ready to Use)

This is the quickest way to get started with a fully-featured editor. Use this if you want to:
- Get up and running quickly
- Have a well-designed editor out of the box
- Focus on content rather than configuration
- Have a production-ready solution with minimal setup

```bash
npm install @milkdown/crepe
```

```typescript
import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
/**
 * Available themes:
 * frame, classic, nord
 * frame-dark, classic-dark, nord-dark
 */
import "@milkdown/crepe/theme/frame.css";

const crepe = new Crepe({
  root: '#app',
  defaultValue: "Hello, Milkdown!",
});

crepe.create().then(() => {
  console.log("Editor created");
});

// To destroy the editor
crepe.destroy();
```

::iframe{src="https://stackblitz.com/github/Milkdown/examples/tree/main/editor-crepe"}

## Next Steps

- Learn more about [overview](/guide/architecture-overview)
- Explore [available plugins](/plugins/using-plugins)
- Check out [theming](/guide/theming)

> 🍼 Fun fact: This documentation is rendered by Milkdown itself!
