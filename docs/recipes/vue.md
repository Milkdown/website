# Vue

We provide vue support out of the box.

> Vue version should be 3.x

## Install the Dependencies

Besides the `@milkdown/core` and theme. We need to install the `@milkdown/vue`, which provides lots of abilities for vue in milkdown.

```bash
# install with npm
npm install @milkdown/vue
npm install @milkdown/kit
npm install @milkdown/theme-nord
```

## Create a Component

Creating a component is pretty easy.

First, we need to create a `MilkdownEditor` component.

```html
<!-- MilkdownEditor.vue -->
<template>
  <Milkdown />
</template>

<script>
import { defineComponent } from "vue";
import { Editor, rootCtx, defaultValueCtx } from "@milkdown/kit/core";
import { nord } from "@milkdown/theme-nord";
import { Milkdown, useEditor } from "@milkdown/vue";
import { commonmark } from "@milkdown/kit/preset/commonmark";

export default defineComponent({
  name: "MilkdownEditor",
  components: {
    Milkdown,
  },
  setup: () => {
    useEditor((root) =>
      Editor.make()
        .config((ctx) => {
          ctx.set(rootCtx, root);
        })
        .config(nord)
        .use(commonmark)
    );
  },
});
</script>
```

Then, we need to create a `MilkdownEditorWrapper` component.

```html
<!-- MilkdownEditorWrapper.vue -->
<template>
  <MilkdownProvider>
    <MilkdownEditor />
  </MilkdownProvider>
</template>

<script>
import { defineComponent } from "vue";
import { MilkdownProvider } from "@milkdown/vue";

export default defineComponent({
  name: "MilkdownEditorWrapper",
  components: {
    MilkdownProvider,
  },
  setup: () => {},
});
</script>
```

## Online Demo

::iframe{src="https://stackblitz.com/github/Milkdown/examples/tree/main/vue-commonmark"}
