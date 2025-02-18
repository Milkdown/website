# Vue

We provide vue support out of the box.

> Vue version should be 3.x

## Using Crepe

### Install the Dependencies

```bash
# install with npm
npm install @milkdown/crepe
npm install @milkdown/vue
npm install @milkdown/kit
```

### Create a Component

Creating a component is pretty easy.

First, we need to create a `MilkdownEditor` component.

```html
<!-- MilkdownEditor.vue -->
<template>
  <Milkdown />
</template>

<script>
  import { Crepe } from "@milkdown/crepe";
  import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/vue";
  import { defineComponent } from "vue";

  export default defineComponent({
    name: "MilkdownEditor",
    components: {
      Milkdown,
    },
    setup: () => {
      const crepe = new Crepe({ root });
      return crepe;
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
  import { MilkdownProvider } from "@milkdown/vue";
  import { defineComponent } from "vue";

  export default defineComponent({
    name: "MilkdownEditorWrapper",
    components: {
      MilkdownProvider,
    },
    setup: () => {},
  });
</script>
```

### Online Demo

::iframe{src="https://stackblitz.com/github/Milkdown/examples/tree/main/vue-crepe"}

---

## Using Milkdown

### Install the Dependencies

Besides the `@milkdown/core` and theme. We need to install the `@milkdown/vue`, which provides lots of abilities for vue in milkdown.

```bash
# install with npm
npm install @milkdown/vue
npm install @milkdown/kit
npm install @milkdown/theme-nord
```

### Create a Component

Creating a component is pretty easy.

First, we need to create a `MilkdownEditor` component.

```html
<!-- MilkdownEditor.vue -->
<template>
  <Milkdown />
</template>

<script>
  import { Editor, rootCtx, defaultValueCtx } from "@milkdown/kit/core";
  import { commonmark } from "@milkdown/kit/preset/commonmark";
  import { nord } from "@milkdown/theme-nord";
  import { Milkdown, useEditor } from "@milkdown/vue";
  import { defineComponent } from "vue";

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
          .use(commonmark),
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
  import { MilkdownProvider } from "@milkdown/vue";
  import { defineComponent } from "vue";

  export default defineComponent({
    name: "MilkdownEditorWrapper",
    components: {
      MilkdownProvider,
    },
    setup: () => {},
  });
</script>
```

### Online Demo

::iframe{src="https://stackblitz.com/github/Milkdown/examples/tree/main/vue-commonmark"}
