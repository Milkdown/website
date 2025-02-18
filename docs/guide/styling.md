# Styling

Milkdown is headless, there are no styles provided by default. That means you can import themes or even create your own themes to control the style of your editor.

## Styling the plain HTML

The whole editor is rendered inside of a container with the class `.milkdown`. And the editable part is wrapped in the container with the class `editor`. You can use that to scope your styling to the editor content:

```css
.milkdown .editor p {
  margin: 1rem 0;
}
```

For every node/mark, milkdown provides a default className, for example, `paragraph` for every p node:

```css
.milkdown .editor .paragraph {
  margin: 1rem 0;
}
```

## Adding custom attributes

You can also add attributes to node/marks. In this way, you can use css libraries such as [tailwind css](https://tailwindcss.com/).

```typescript
import { Editor, editorViewOptionsCtx } from '@milkdown/kit/core';
import { commonmark, headingAttr, paragraphAttr } from '@milkdown/kit/preset/commonmark';

Editor
  .make()
  .config((ctx) => {
    // Add attributes to the editor container
    ctx.update(editorViewOptionsCtx, (prev) => ({
      ...prev,
      attributes: { class: 'milkdown-editor mx-auto outline-none', spellcheck: 'false' },
    }))

    // Add attributes to nodes and marks
    ctx.set(headingAttr.key, (node) => {
      const level = node.attrs.level;
      if (level === 1) return { class: 'text-4xl', data-el-type: 'h1' };
      if (level === 2) return { class: 'text-3xl', data-el-type: 'h2' };
      // ...
    })
    ctx.set(paragraphAttr.key, () => ({ class: 'text-lg' }));
  })
  .use(commonmark)
```

## Writing your own theme

It's possible to write your own theme. Generally speaking, themes are defined by the two ways above:
Some configs are needed to add attributes, and some css is used to style them.

```typescript
import { Ctx } from "@milkdown/kit/core";
// If you need to style tables, you should import this css file.
import "@milkdown/kit/prose/tables/style/tables.css";
// You should import these predefined prosemirror css styles.
import "@milkdown/kit/prose/view/style/prosemirror.css";

// Your css file.
import "./my-theme.css";

// Your config.
export const myThemeConfig = (ctx: Ctx) => {
  ctx.update(editorViewOptionsCtx, (prev) => ({
    ...prev,
    attributes: {
      class: "milkdown milkdown-theme-my-theme",
    },
  }));
};
```

You can view the source code of [@milkdown/theme-nord](https://github.com/Milkdown/milkdown/tree/main/packages/theme-nord)
or [@milkdown/crepe/theme](https://github.com/Milkdown/milkdown/tree/main/packages/crepe/src/theme) to get some inspiration.
