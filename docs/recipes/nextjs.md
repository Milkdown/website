# Next.js

Since we provide [react](/docs/recipes/react) support out of box, we can use it directly in [Next.js](https://nextjs.org/).

## Install the Dependencies

Except the `@milkdown/kit` and theme. We need to install the `@milkdown/react`, which provide lots of abilities for react in milkdown.

```bash
# install with npm
npm install @milkdown/react
npm install @milkdown/kit
npm install @milkdown/theme-nord
```

## Create a Component

Create a component is pretty easy.

```tsx
import { Editor, rootCtx } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { nord } from "@milkdown/theme-nord";
import React from "react";

const MilkdownEditor: React.FC = () => {
  const { editor } = useEditor((root) =>
    Editor.make()
      .config(nord)
      .config((ctx) => {
        ctx.set(rootCtx, root);
      })
      .use(commonmark),
  );

  return <Milkdown />;
};

export const MilkdownEditorWrapper: React.FC = () => {
  return (
    <MilkdownProvider>
      <MilkdownEditor />
    </MilkdownProvider>
  );
};
```

## Online Demo

::iframe{src="https://stackblitz.com/github/Milkdown/examples/tree/main/next-commonmark"}
