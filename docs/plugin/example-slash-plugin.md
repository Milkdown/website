# Example: Slash Plugin

After reading the tooltip guide you already know how Milkdown separates **positioning logic** (provider) from **editor wiring** (ctx slices produced by a factory).
The `@milkdown/plugin-slash` package applies exactly the same idea but focuses on _command palettes_ triggered by a character – familiar to `/` menus in modern editors.

This document shows you how to:

- Understand what the slash plugin gives you out-of-the-box.
- Build a **vanilla TypeScript** implementation of a basic `/` menu.
- Use the slash provider with **React** and **Vue**.
- Explore a full-blown menu feature that ships inside Milkdown's Crepe UI.

---

## 1. Anatomy of a Slash Plugin

`@milkdown/plugin-slash` exports two utilities:

1. **`SlashProvider`** – Measures the caret position and manages show / hide of your menu.
2. **`slashFactory(id)`** – Generates a ctx slice & ProseMirror plugin pair that plugs the provider into the editor.

```ts
import { slashFactory } from "@milkdown/plugin-slash";

export const [mySlashSpec, mySlashPlugin] = slashFactory("my");
```

Just like the tooltip factory:

- `mySlashSpec` is where you put a `PluginSpec` (what ProseMirror needs).
- `mySlashPlugin` turns that spec into a runtime plugin.

---

## 2. A Minimal Vanilla `/` Menu

Below we create a small menu that suggests two commands whenever the user types `/`.

```ts
import { SlashProvider, slashFactory } from "@milkdown/plugin-slash";
import { Editor } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";

// DOM content of the menu – plain HTML for the demo
const menu = document.createElement("div");
menu.className = "slash-menu";
menu.style.cssText = `
  position:absolute;padding:4px 0;background:white;border:1px solid #eee;
  box-shadow:0 2px 8px rgba(0,0,0,.15);border-radius:6px;font-size:14px;
`;
menu.innerHTML = `<ul style="margin:0;padding:0;list-style:none">
  <li data-cmd="h1" style="padding:4px 12px;cursor:pointer">Heading 1</li>
  <li data-cmd="bullet" style="padding:4px 12px;cursor:pointer">Bullet List</li>
</ul>`;

// Click handler – replace with real commands
menu.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  const cmd = target.dataset.cmd;
  alert(`Run command: ${cmd}`);
});

// Provider positions & shows above DOM element
const provider = new SlashProvider({
  content: menu,
  // show the menu when the last character before caret is '/'
  shouldShow(view) {
    return provider.getContent(view)?.endsWith("/") ?? false;
  },
  offset: 8,
});

const [slashSpec, slashPlugin] = slashFactory("demo");
slashSpec.set({
  view: () => ({
    update: provider.update,
    destroy: provider.destroy,
  }),
});

Editor.make().use(commonmark).use(slashSpec).use(slashPlugin).create();
```

Key takeaways:

- `SlashProvider` has a helper `getContent(view)` to fetch text before the caret – handy for filtering.
- You decide **when to show** the menu via the `shouldShow` callback (default: when last char is `/`).
- The provider only manipulates **position + visibility**; rendering & commands are completely yours.

---

## 3. Framework Examples

### React

::iframe{src="https://stackblitz.com/github/Milkdown/examples/tree/main/react-slash"}

Highlights:

1. A `<SlashMenu/>` React component renders the list.
2. The component root is passed to `SlashProvider` (just like the tooltip demo).
3. React hooks manage internal focus & keyboard navigation.

### Vue

::iframe{src="https://stackblitz.com/github/Milkdown/examples/tree/main/vue-slash"}

The Vue version uses `Teleport` to append the menu to `document.body` and `ref` / `watch` for reactivity.

---

## 4. Real-world Feature – Crepe Block Menu

Milkdown's **Crepe** UI implements an extensible block-level menu on top of the slash plugin. You'll find the source code at:

```text
packages/crepe/src/feature/block-edit/menu/
```

Notable patterns to look for:

- **Context slices** (`menu` / `menuAPI`) to expose imperative `show` & `hide` methods.
- Filtering commands based on the current text after `/`.
- Preventing the menu inside `code` blocks or lists.

Studying this folder is a great next step once you master the basics.

---

## 5. Summary & Next Steps

- `@milkdown/plugin-slash` gives you caret detection + positioning – nothing else.
- UI, behaviour, and commands are fully customisable.

Fork one of the examples above, add your own commands, and you'll have a modern `/` command palette in minutes ✨.
