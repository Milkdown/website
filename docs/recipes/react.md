# React

We provide react support out of box.

## Install the Dependencies

Except the `@milkdown/core`, preset and theme. We need to install the `@milkdown/react`, which provide lots of abilities for react in milkdown.

```bash
# install with npm
npm install @milkdown/react

npm install @milkdown/core @milkdown/prose @milkdown/ctx @milkdown/transformer

npm install @milkdown/preset-commonmark @milkdown/theme-nord
```

## Create a Component

Create a component by using the `useEditor()` hook:

```typescript
import React from 'react';
import { Editor, rootCtx } from '@milkdown/core';
import { nord } from '@milkdown/theme-nord';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import { commonmark } from '@milkdown/preset-commonmark';

const MilkdownEditor: React.FC = () => {
    const { get } = useEditor((root) =>
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

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Milkdown/examples/tree/main/react-commonmark)

## Accessing the editor instance

If you seperated the editor into a component you may need to access its instance from outside to perform actions or get the content.
You can do this by using the `useInstance()` hook. Note that your component must be inside the `<MilkdownProvider>`.
