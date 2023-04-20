# Svelte

We don't provide Svelte support out of box, but you can use the vanilla version with it easily.

## Install the Dependencies

```bash
# install with npm
npm install @milkdown/core @milkdown/prose @milkdown/ctx @milkdown/transformer
npm install @milkdown/preset-commonmark @milkdown/theme-nord
```

## Creating a Component

Creating a component is pretty easy.

```html
<script>
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/core';
import { commonmark } from '@milkdown/preset-commonmark';
import { nord } from '@milkdown/theme-nord';

function editor(dom) {
  // to obtain the editor instance we need to store a reference of the editor.
  const MakeEditor = Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, dom);
    })
    .config(nord)
    .use(commonmark)
    .create();
}
MakeEditor.then((editor) => {
  // here you have access to the editor instance.
  
  // const exampleContent = "# Hello World!";
  // editor.action(replaceAll(exampleContent));
})
</script>

<div use:editor />
```

## Online Demo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Milkdown/examples/tree/main/svelte-commonmark)
