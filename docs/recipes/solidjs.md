# SolidJS

We don't provide SolidJS support out of box, but you can use the vanilla version with it easily.

## Install the Dependencies

```bash
# install with npm
npm install @milkdown/kit
npm install @milkdown/theme-nord
```

## Create a Component

Create a component is pretty easy.

```tsx
import { defaultValueCtx, Editor, rootCtx } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { nord } from "@milkdown/theme-nord";
import { onCleanup, onMount } from "solid-js";

const Milkdown = () => {
  let ref;
  let editor;
  onMount(async () => {
    editor = await Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, ref);
      })
      .config(nord)
      .use(commonmark)
      .create();
  });

  onCleanup(() => {
    editor.destroy();
  });

  return <div ref={ref} />;
};
```

## Online Demo

::iframe{src="https://stackblitz.com/github/Milkdown/examples/tree/main/solid-commonmark"}
