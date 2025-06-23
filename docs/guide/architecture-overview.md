# Architecture Overview

Milkdown is built with a modular, layered architecture that provides flexibility and extensibility. This document explains the core architectural concepts and how they work together.

![0.75](/guide/milkdown-architecture.png "Milkdown Architecture")

## Core Architecture Layers

Milkdown's architecture is built upon four distinct layers, each providing specific functionality and extensibility:

### 🥛 Core Layer

The foundation of Milkdown that provides:

- Plugin loading and management system
- Core editor concepts and interfaces
- Base document model integration
- Essential utilities and helpers

### 🧇 Plugin Layer

A comprehensive collection of modular plugins that extend the editor's functionality:

- Syntax plugins (Markdown parsing, GFM, etc.)
- UI plugins (toolbar, menu, etc.)
- Feature plugins (image upload, table, etc.)
- Utility plugins (history, clipboard, etc.)

### 🍮 Component Layer

Headless UI components that serve as building blocks:

- Toolbar components
- Slash menu components
- Table components

### 🍰 Editor Layer

Ready-to-use, user-friendly editors:

- Crepe editor
- Custom editor implementations

## Architecture Benefits

This layered approach provides several key benefits:

1. **Modularity**: Each layer can be used independently
2. **Flexibility**: Mix and match components as needed
3. **Extensibility**: Create custom implementations at any layer
4. **Maintainability**: Clear separation of concerns
5. **Reusability**: Components can be shared across implementations

## Markdown Transformation

![0.75](/guide/transformer.png "Transformer")

Milkdown's transformation system handles the conversion between Markdown and the editor's internal document model:

### Parsing Process

1. Markdown text → Remark AST
2. Remark AST → ProseMirror Schema
3. Schema → ProseMirror Document

### Serialization Process

1. ProseMirror Document → ProseMirror Schema
2. Schema → Remark AST
3. Remark AST → Markdown text

This transformation system ensures:

- Accurate Markdown parsing
- Consistent document structure
- Reliable serialization
- Extensible transformation pipeline

## Context System

The Context System is a powerful state management and dependency coordination system that enables plugins to work together seamlessly.

![1.00](/guide/plugin-sequence.png "Plugin Sequence")

### Core Concepts

#### 1. Context (Ctx)

The main interface for plugins to interact with the system:

```typescript
interface Ctx {
  get: <T>(slice: Slice<T>) => T;
  set: <T>(slice: Slice<T>, value: T) => void;
  wait: (timer: Timer) => Promise<void>;
  done: (timer: Timer) => void;
  inject: <T>(slice: Slice<T>, value: T) => void;
  remove: <T>(slice: Slice<T>) => void;
}
```

#### 2. Slices

State containers that can be shared between plugins:

```typescript
// Create a slice with initial value and name
const themeSlice = createSlice("light", "theme");

// Use in a plugin
const themePlugin: MilkdownPlugin = (ctx) => {
  return () => {
    // Read current theme
    const theme = ctx.get(themeSlice);

    // Update theme
    ctx.set(themeSlice, "dark");

    // React to theme changes
    ctx.watch(themeSlice, (newTheme) => {
      // Handle theme change
    });
  };
};
```

#### 3. Timers

Dependency management system for plugin coordination:

```typescript
// Define a timer
const dataReady = createTimer("DataReady");

// Use in a plugin
const dataPlugin: MilkdownPlugin = (ctx) => {
  ctx.record(dataReady);

  return async () => {
    // Wait for dependencies
    await ctx.wait(SchemaReady);

    // Do work
    // ...

    // Mark as ready
    ctx.done(dataReady);
  };
};
```

### Plugin Lifecycle

Plugins follow a consistent lifecycle pattern:

```typescript
const examplePlugin: MilkdownPlugin = (ctx) => {
  // 1. Setup Phase
  ctx.inject(mySlice, defaultValue);
  ctx.record(myTimer);

  return async () => {
    // 2. Initialization Phase
    await ctx.wait(RequiredTimer);

    // 3. Runtime Phase
    const value = ctx.get(mySlice);
    ctx.set(mySlice, newValue);

    // 4. Cleanup Phase
    return () => {
      ctx.remove(mySlice);
    };
  };
};
```

### Best Practices

1. **State Management**
   - Use slices for shared state
   - Keep state minimal and focused
   - Watch for state changes when needed

2. **Dependency Management**
   - Use timers for coordination
   - Wait for required dependencies
   - Mark completion appropriately

3. **Plugin Organization**
   - Follow the lifecycle pattern
   - Clean up resources properly
   - Document dependencies clearly

## Next Steps

- Start to [use Crepe editor](/docs/guide/using-crepe)
- Learn more about [writing plugins](/docs/plugin/plugins-101)
- Explore [available plugins](/docs/plugin/using-plugins)
