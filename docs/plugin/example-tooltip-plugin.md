# Example: Tooltip Plugin

This guide walks you through creating and using **tooltip-based plugins** in Milkdown.
You will learn how the low-level `@milkdown/plugin-tooltip` works and how to build richer experiences on top of it in **vanilla TypeScript**, **React**, and **Vue**.

> **TL;DR** – A tooltip in Milkdown is nothing more than a ProseMirror plugin created by `tooltipFactory(id)`.
> It receives position information from the editor and renders any DOM of your choice.
> Everything else (buttons, inputs, styling, framework bindings) can be composed on top of that.

## 1. Anatomy of a Tooltip

---

At its core the tooltip plugin exported from `@milkdown/plugin-tooltip` contains two helpers:

1. **`TooltipProvider`** – An utility class powered by [floating-ui](https://floating-ui.com/) to calculate the tooltip position.
2. **`tooltipFactory(id)`** – A factory that returns a pair of Milkdown plugin slices which wire the provider into the editor.

The factory is extremely small (≈40 lines):

```ts
import { tooltipFactory } from "@milkdown/plugin-tooltip";

// Create a tooltip identified by the string "my".
export const [myTooltipSpec, myTooltipPlugin] = tooltipFactory("my");
```

The first element (`myTooltipSpec`) is a **ctx slice** that stores a `PluginSpec`, while the second one (`myTooltipPlugin`) is the real ProseMirror plugin which consumes that spec.

## 2. A Minimal Vanilla Tooltip

---

Below is the complete code for a tooltip that shows the **length of the current selection**.

```ts
import { Editor } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { TooltipProvider, tooltipFactory } from "@milkdown/plugin-tooltip";

// 1) Prepare DOM that we will mount into the page.
const el = document.createElement("div");
el.className = "selection-length";
el.style.cssText = `
  pointer-events:none;
  background:#333;color:#fff;padding:2px 6px;border-radius:4px;font-size:12px;
`;

// 2) Build a provider which updates the content.
const provider = new TooltipProvider({
  content: el,
  shouldShow: (view) => !!view.state.selection.content().size,
});

// 3) Bridge provider & editor.
const [selectionTooltipSpec, selectionTooltip] = tooltipFactory("sel-length");
selectionTooltipSpec.set({
  view: () => ({
    update: provider.update,
    destroy: provider.destroy,
  }),
});

Editor.make()
  .use(commonmark)
  .use(selectionTooltipSpec)
  .use(selectionTooltip)
  .create();
```

Key points:

- We **create** any DOM element we like (`el`).
- `TooltipProvider` tracks the editor position and moves the element.
- `tooltipFactory` wraps the provider into a pluggable slice.

## 3. Framework Examples

---

Sometimes building UI is easier in your favourite framework.
Because the tooltip provider only deals with **DOM elements**, you can freely render React, Vue or Svelte components and pass their root node to the provider.

### React

::iframe{src="https://stackblitz.com/github/Milkdown/examples/tree/main/react-tooltip"}

The React example shows how to:

1. Create a React component (`<SelectionTooltip/>`).
2. Render it into a portal and give the root HTML element to `TooltipProvider`.
3. Re-use React state/hooks while Milkdown takes care of positioning.

### Vue

::iframe{src="https://stackblitz.com/github/Milkdown/examples/tree/main/vue-tooltip"}

The Vue example follows the same pattern with `defineComponent` and `teleport`.

## 4. Real-world Examples

---

### 4-1. Link Tooltip (_@milkdown/component/link-tooltip_)

The [link tooltip](https://github.com/Milkdown/milkdown/tree/main/packages/components/src/link-tooltip) demonstrates how to:

- Maintain UI **state** (`preview` vs `edit`) in ctx slices.
- Communicate with the editor through an **API slice** (add / edit / remove links).
- Render framework-agnostic UI inside a tooltip provider.

Have a look at the files below to see those techniques in action:

```text
packages/components/src/link-tooltip/
├── slices.ts      # state & API slices
├── tooltips.ts    # preview & edit providers
└── component.tsx  # (framework examples)
```

### 4-2. Toolbar Feature (_@milkdown/crepe/feature/toolbar_)

The toolbar in the [crepe](https://github.com/Milkdown/milkdown/tree/main/packages/crepe) package pushes the idea further by:

- Using multiple tooltip instances (one per button group).
- Rendering the UI with Vue _inside_ the provider.
- Sharing configuration via ctx slices so that every button is extensible by third-party plugins.

You can browse the implementation starting from

```text
packages/crepe/src/feature/toolbar/component.tsx
```

## 5. Summary & Next Steps

---

- `@milkdown/plugin-tooltip` offers **just enough** abstraction: positioning & lifecycle.
- Everything else – **state, styling, framework integration** – is totally up to you.

Try to customise one of the examples above, then ship your own tooltip-powered features 🤟.
