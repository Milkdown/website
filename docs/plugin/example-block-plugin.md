# Example: Block Plugin

The **block plugin** adds a positional hook next to every top-level node (paragraphs, headings, lists, etc.).
It is the foundation for features such as drag handles, quick-insert buttons or block toolbars.

In Milkdown this functionality lives in `@milkdown/plugin-block` and – consistent with tooltip & slash – consists of:

- a **BlockProvider** that deals with DOM positioning/lifecycle
- a **blockFactory** – _implemented internally_ – exposed as two ctx slices: `blockSpec`, `blockPlugin`

This guide covers:

- Understanding the provider/service architecture.
- Writing a **vanilla TypeScript** drag handle that lets you reorder blocks.
- Mounting custom UIs in **React** and **Vue**.
- Studying the production-ready _Block Handle_ feature inside Crepe.

---

## 1. Anatomy of a Block Plugin

Unlike tooltip/slash, `@milkdown/plugin-block` ships its factory slices directly:

```ts
import { blockSpec, blockPlugin } from "@milkdown/plugin-block";
```

You normally interact with **BlockProvider** which talks to an internal _BlockService_: the service listens to mouse / drag events, figures out which node is **active** and sends `show` / `hide` messages to the provider.
Your job is to decide how to render a UI for that active node.

Key APIs:

- `new BlockProvider({ ctx, content, ... })` – similar to Tooltip/Slash.
- `provider.active` – info about the currently focused block (`node`, `pos`, `el`).
- Optional callbacks: `getOffset`, `getPlacement`, `getPosition` for fine-grained positioning.

---

## 2. Minimal Vanilla Drag Handle

Below we build a small **drag handle** that appears on hover and lets you drag-n-drop any block.

```ts
import { block, blockPlugin } from "@milkdown/plugin-block";
import { BlockProvider } from "@milkdown/plugin-block/block-provider"; // path depending on bundler
import { Editor } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";

// 1️⃣ Create DOM element for the handle
const handle = document.createElement("div");
handle.className = "drag-handle";
handle.innerHTML = "≡";
handle.style.cssText = `
  width:20px;height:20px;display:flex;align-items:center;justify-content:center;
  cursor:grab;border-radius:4px;background:#f2f3f5;color:#555;user-select:none;
`;

// 2️⃣ Build provider – show only when mouse is over a block
const provider = (ctx: Ctx) => {
  const provider = new BlockProvider({
    ctx,
    content: handle,
    getOffset: () => 8,
  });

  return {
    update: provider.update,
    destroy: provider.destroy,
  };
};

// 3️⃣ Wire provider to Milkdown
const blockConfig = (ctx: Ctx) => {
  ctx.set(blockSpec.key, {
    view: provider(ctx),
  });
};

Editor.make().config(blockConfig).use(commonmark).use(block).create();
```

Drag & Drop:

The HTML element has `cursor:grab`. The internal `BlockService` automatically sets `draggable` and wires ProseMirror's drag-events so you can reorder blocks without extra code 👉 nice!

---

## 3. Framework Examples

### React

::iframe{src="https://stackblitz.com/github/Milkdown/examples/tree/main/react-block"}

The React demo renders a `<BlockHandle/>` component, keeps drag state in hooks and feeds the root element to `BlockProvider`.

### Vue

::iframe{src="https://stackblitz.com/github/Milkdown/examples/tree/main/vue-block"}

Vue's `<BlockHandle>` uses `Teleport` and reactive refs exactly like the tooltip/slash examples.

---

## 4. Real-world Feature – Crepe Block Handle

Crepe brings all the pieces together to create a **block edit** experience that combines a drag handle **and** a plus-button to open the slash menu:

```text
packages/crepe/src/feature/block-edit/handle/
```

Things worth exploring:

1. **Dynamic placement** via `getPlacement` (centred vs top-aligned depending on node height).
2. Filtering nodes with `blockConfig.filterNodes` so handles do not appear inside tables / math / blockquotes.
3. Programmatically showing the _slash menu_ after pressing the "+" button.

---

## 5. Summary & Next Steps

`@milkdown/plugin-block` is the Swiss-army knife for any block-level UI: drag handles, add-buttons, side toolbars…
Combine it with tooltip/slash to build sophisticated editors.

Hack on the examples, tweak positioning callbacks, and ship your own block goodies 🚀.
