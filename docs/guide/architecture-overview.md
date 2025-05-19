# Architecture Overview

![0.75](/guide/milkdown-architecture.png "Milkdown Architecture")

Milkdown's architecture is built upon four distinct layers, each providing specific functionality and extensibility:

- [x] 🥛 **Core**: The foundation of Milkdown, providing essential plugin loading capabilities and core editor concepts.
- [x] 🧇 **Plugins**: A comprehensive collection of modular plugins that extend the editor's functionality.
- [x] 🍮 **Components**: Headless UI components that serve as building blocks for custom editor implementations.
- [x] 🍰 **Editors**: Ready-to-use, user-friendly editors built on top of the plugin and component layers.

The architecture follows a hierarchical design where editors are constructed using components, which in turn are built upon plugins, all of which rely on the core foundation. This layered approach ensures modularity and flexibility, allowing developers to:

- Use any layer independently
- Create custom components
- Develop new plugins
- Build specialized editors

Each layer maintains its independence while providing a cohesive development experience.

---

# Markdown Transformation

![0.75](/guide/transformer.png "Transformer")

Milkdown's transformation system operates through two fundamental processes:

- [x] 🛫 **Parsing**: Transforms Markdown text into a ProseMirror document model
- [x] 🛬 **Serialization**: Converts the ProseMirror document model back into Markdown text

This transformation system leverages the Remark ecosystem for Markdown processing while seamlessly integrating with ProseMirror's document model architecture.

---

# Context System

The Context System manages state and dependencies in Milkdown. It helps plugins share data and coordinate their behavior.

![1.00](/guide/plugin-sequence.png "Plugin Sequence")

## Core Elements

```typescript
// Create a slice to store a value
const counterSlice = createSlice(0, 'counter');

// Create a timer to manage dependencies
const dataReady = createTimer('DataReady');

// Use the context in a plugin
const myPlugin: MilkdownPlugin = (ctx) => {
  // Register the timer
  ctx.record(dataReady);

  return async () => {
    // Wait for other plugins
    await ctx.wait(SchemaReady);

    // Get and update state
    const count = ctx.get(counterSlice);
    ctx.set(counterSlice, count + 1);

    // Mark this plugin as ready
    ctx.done(dataReady);
  };
};
```

The system has three main parts:

- **Ctx**: The main interface for plugins to interact with the system
- **Container**: Stores all the state
- **Clock**: Manages when plugins should run

## State Management

Plugins can share data through slices:

```typescript
// Create a slice
const themeSlice = createSlice('light', 'theme');

// Use it in a plugin
const themePlugin: MilkdownPlugin = (ctx) => {
  return () => {
    // Read the theme
    const theme = ctx.get(themeSlice);

    // Change the theme
    ctx.set(themeSlice, 'dark');
  };
};
```

## Plugin Integration

Plugins follow a simple pattern:

```typescript
const examplePlugin: MilkdownPlugin = (ctx) => {
  // 1. Setup
  ctx.inject(mySlice, defaultValue);

  return async () => {
    // 2. Wait for dependencies
    await ctx.wait(RequiredTimer);

    // 3. Do work
    // ...

    // 4. Clean up
    return () => {
      ctx.remove(mySlice);
    };
  };
};
```

This system makes Milkdown flexible and easy to extend.

If you want to learn more about how to write plugins, you can read the [Plugins 101](/docs/plugin/plugins-101).

