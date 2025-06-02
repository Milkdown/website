# Example: Marker Plugin

This guide demonstrates how to create a custom marker syntax plugin for Milkdown. This plugin allows you to mark text with custom colors using a simple markdown syntax.

## Overview

---

The marker plugin enables you to mark text using the following syntax:

```markdown
==marked text==
=={#EE4B2B}marked text with color==
```

This will render as marked text in your document, with the option to specify custom colors.

## Implementation Steps

---

To create a custom marker syntax plugin in Milkdown, we need to implement several components:

1. **Remark Plugin**: Parse the custom syntax
2. **Schema Definition**: Define the mark structure
3. **Parser**: Convert markdown to ProseMirror marks
4. **Serializer**: Convert ProseMirror marks back to markdown
5. **Input Rules**: Handle user input
6. **Color Picker**: Add UI for color selection

Let's implement each component:

## 1. Remark Plugin

---

First, we create a remark plugin to handle our custom marker syntax:

> ⚠️ The real implementation is more complex, but we simplify it for the sake of the example.
> Under the hood, you'll need to write a [micromark extension](https://github.com/micromark/micromark) to make it works correctly.

```typescript
import { $remark } from "@milkdown/kit/utils";

const remarkMarkColor = () => {
  return (tree: any) => {
    visit(tree, "text", (node: any, index: number, parent: any) => {
      const match = node.value.match(/==(?:{#([^}]+)})?([^=]+)==/);
      if (match) {
        const [_, color, text] = match;
        const mark = {
          type: "mark",
          data: { color },
          children: [{ type: "text", value: text }],
        };
        parent.children.splice(index, 1, mark);
      }
    });
  };
};

const milkdownMarkColorPlugin = $remark("markColor", () => remarkMarkColor);
```

## 2. Schema Definition

---

Next, we define the schema for our marker:

```typescript
import { $markSchema } from "@milkdown/kit/utils";
import { Mark } from "mdast";

export const DEFAULT_COLOR = "#ffff00";

export const markSchema = $markSchema("mark", () => ({
  attrs: {
    color: {
      default: DEFAULT_COLOR,
      validate: "string",
    },
  },
  parseDOM: [
    {
      tag: "mark",
      getAttrs: (node: HTMLElement) => ({
        color: node.style.backgroundColor,
      }),
    },
  ],
  toDOM: (mark) => ["mark", { style: `background-color: ${mark.attrs.color}` }],
  parseMarkdown: {
    match: (node) => node.type === "mark",
    runner: (state, node, markType) => {
      const color = (node as Mark).data?.color;
      state.openMark(markType, { color });
      state.next(node.children);
      state.closeMark(markType);
    },
  },
  toMarkdown: {
    match: (node) => node.type.name === "mark",
    runner: (state, mark) => {
      let color = mark.attrs.color;
      if (color?.toLowerCase() === DEFAULT_COLOR.toLowerCase()) {
        color = undefined;
      }
      state.withMark(mark, "mark", undefined, {
        data: { color },
      });
    },
  },
}));
```

## 3. Input Rules

---

We add input rules to handle user typing:

```typescript
import { $inputRule } from "@milkdown/kit/utils";
import { InputRule } from "@milkdown/kit/prose";

const markInputRule = $inputRule(
  () =>
    new InputRule(/==(?:{#([^}]+)})?([^=]+)==/, (state, match, start, end) => {
      const [okay, color, text] = match;
      const { tr } = state;
      if (okay) {
        tr.addMark(
          start,
          end,
          markSchema.type().create({ color: color || DEFAULT_COLOR }),
        );
      }
      return tr;
    }),
);
```

## 4. Color Picker Tooltip

---

To enhance the user experience, we add a color picker tooltip:

```typescript
import { $tooltip } from "@milkdown/kit/utils";

const colorPickerTooltip = $tooltip("colorPicker", () => ({
  items: [
    { text: "Yellow", color: "#ffff00" },
    { text: "Red", color: "#ff0000" },
    { text: "Blue", color: "#0000ff" },
    // Add more colors as needed
  ],
  onSelect: (color: string) => {
    // Apply the selected color to the current selection
  },
}));
```

## Usage

---

To use the marker plugin, add it to your Milkdown editor configuration:

```typescript
import { Editor } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";

Editor.make()
  .use(milkdownMarkColorPlugin)
  .use(markSchema)
  .use(markInputRule)
  .use(colorPickerTooltip)
  .use(commonmark)
  .create();
```

## Example

---

Here's a complete example of the marker plugin in action:

::iframe{src="https://stackblitz.com/github/Milkdown/examples/tree/main/vanilla-highlight-syntax"}
