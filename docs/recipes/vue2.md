# Vue2

We don't provide Vue2 support out of box, but you can use the vanilla version with it easily.

## Install the Dependencies

```bash
# install with npm
npm install @milkdown/kit
npm install @milkdown/theme-nord
```

## Create a Component

Create a component is pretty easy.

```html
<template>
  <div ref="editor"></div>
</template>

<script>
  import { defaultValueCtx, Editor, rootCtx } from '@milkdown/kit/core';
  import { nord } from '@milkdown/theme-nord';
  import { commonmark } from '@milkdown/kit/preset/commonmark';
  export default {
    name: 'Editor',
    props: {
      msg: String,
    },
    mounted() {
      Editor.make()
        .config((ctx) => {
          ctx.set(rootCtx, this.$refs.editor);
          ctx.set(defaultValueCtx, this.$props.msg);
        })
        .config(nord)
        .use(commonmark)
        .create();
    },
  };
</script>
```
