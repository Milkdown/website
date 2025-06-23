# Vue Integration

Milkdown provides first-class Vue support with dedicated packages and hooks for seamless integration. You can choose between Crepe, our feature-rich WYSIWYG editor, or the core Milkdown editor for more customization options.

> Vue version should be 3.x

## Using Crepe

---

Crepe is a powerful, feature-rich Markdown editor built on top of Milkdown that provides a more user-friendly editing experience.

### Installation

```bash
npm install @milkdown/crepe @milkdown/vue @milkdown/kit
```

### Implementation

```vue
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
    const { get } = useEditor((root) => {
      return new Crepe({ root });
    });
  },
});
</script>

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
});
</script>
```

### Online Demo

::iframe{src="https://stackblitz.com/github/Milkdown/examples/tree/main/vue-crepe"}

## Using Milkdown

---

For more advanced use cases or when you need full control over the editor's configuration, you can use the core Milkdown editor directly.

### Install Dependencies

```bash
npm install @milkdown/vue @milkdown/kit @milkdown/theme-nord
```

### Basic Usage

Here's a minimal example to get started:

```vue
<!-- MilkdownEditor.vue -->
<template>
  <Milkdown />
</template>

<script>
import { Editor, rootCtx } from "@milkdown/kit/core";
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
    const { get } = useEditor((root) =>
      Editor.make()
        .config(nord)
        .config((ctx) => {
          ctx.set(rootCtx, root);
        })
        .use(commonmark),
    );
  },
});
</script>

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
});
</script>
```

::iframe{src="https://stackblitz.com/github/Milkdown/examples/tree/main/vue-commonmark"}

## Advanced Usage

---

### Accessing Editor Instance

The `useInstance()` hook can only be used within components that are children of `MilkdownProvider`. It returns a tuple containing a loading state and a getter function to access the editor instance.

```vue
<!-- EditorControls.vue -->
<template>
  <button @click="handleSave" :disabled="isLoading">Save</button>
</template>

<script>
import { useInstance } from "@milkdown/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "EditorControls",
  setup: () => {
    const [isLoading, getInstance] = useInstance();

    const handleSave = () => {
      if (isLoading.value) return;

      const editor = getInstance();
      if (!editor) return;

      const content = editor.getMarkdown();
      // Do something with the content
    };

    return {
      isLoading,
      handleSave,
    };
  },
});
</script>

<!-- EditorWithControls.vue -->
<template>
  <MilkdownProvider>
    <MilkdownEditor />
    <EditorControls />
  </MilkdownProvider>
</template>

<script>
import { MilkdownProvider } from "@milkdown/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "EditorWithControls",
  components: {
    MilkdownProvider,
  },
});
</script>
```

### Best Practices

1. **Component Structure**
   - Keep the editor component separate from business logic
   - Wrap the editor with `MilkdownProvider` at the highest necessary level
   - Use TypeScript for better type safety

2. **Performance**
   - Memoize the editor configuration if it's complex
   - Use Vue's `shallowRef` for editor instance if needed
   - Avoid unnecessary re-renders of the editor

### Common Use Cases

**Form Integration**

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <MilkdownEditorWrapper />
    <button type="submit" :disabled="isLoading">Submit</button>
  </form>
</template>

<script>
import { useInstance } from "@milkdown/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "FormWithEditor",
  setup: () => {
    const [isLoading, getInstance] = useInstance();

    const handleSubmit = () => {
      if (isLoading.value) return;

      const editor = getInstance();
      if (!editor) return;

      const content = editor.getMarkdown();
      // Submit form with content
    };

    return {
      isLoading,
      handleSubmit,
    };
  },
});
</script>
```

**Auto-save**

```vue
<template>
  <Milkdown />
</template>

<script>
import { Editor, rootCtx } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { Milkdown, useEditor } from "@milkdown/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "AutoSaveEditor",
  components: {
    Milkdown,
  },
  setup: () => {
    const { get } = useEditor((root) =>
      Editor.make()
        .config((ctx) => {
          ctx.set(rootCtx, root);
          // Add markdown listener for auto-save
          ctx.get(listenerCtx).markdownUpdated((ctx, markdown) => {
            // Save content to your backend or storage
            saveToBackend(markdown);
          });
        })
        .use(commonmark)
        .use(listener),
    );
  },
});
</script>
```

## More Examples

---

- [Examples Repository](https://github.com/Milkdown/examples)
