# Keyboard Shortcuts

Keyboard shortcuts are a crucial part of the editor's user experience. Milkdown provides a flexible system for configuring keyboard shortcuts through presets and plugins.

## Default Shortcuts

---

Milkdown comes with a set of default keyboard shortcuts from both presets and plugins. Here's a comprehensive list of all internal shortcuts:

> #### 💡 Note
>
> `Mod` represents the platform-specific modifier key:
>
> - Windows/Linux: `Ctrl`
> - macOS: `Command`

### Commonmark Preset Shortcuts

#### Headings

| Shortcut             | Description             |
| -------------------- | ----------------------- |
| `Mod-Alt-1`          | Turn block into h1      |
| `Mod-Alt-2`          | Turn block into h2      |
| `Mod-Alt-3`          | Turn block into h3      |
| `Mod-Alt-4`          | Turn block into h4      |
| `Mod-Alt-5`          | Turn block into h5      |
| `Mod-Alt-6`          | Turn block into h6      |
| `Delete`/`Backspace` | Downgrade heading level |

#### Block Elements

| Shortcut      | Description                  |
| ------------- | ---------------------------- |
| `Mod-Shift-b` | Wrap selection in blockquote |
| `Mod-Shift-8` | Wrap in bullet list          |
| `Mod-Shift-7` | Wrap in ordered list         |
| `Mod-Shift-c` | Wrap in code block           |
| `Shift-Enter` | Insert hard break            |
| `Mod-Alt-0`   | Wrap in paragraph            |

#### Text Formatting

| Shortcut | Description        |
| -------- | ------------------ |
| `Mod-b`  | Toggle bold        |
| `Mod-i`  | Toggle italic      |
| `Mod-e`  | Toggle inline code |

### GFM Preset Shortcuts

#### Text Formatting

| Shortcut    | Description          |
| ----------- | -------------------- |
| `Mod-Alt-x` | Toggle strikethrough |

#### Tables

| Shortcut            | Description                      |
| ------------------- | -------------------------------- |
| `Mod-]`             | Move to next cell                |
| `Mod-[`             | Move to previous cell            |
| `Mod-Enter`/`Enter` | Exit table and break if possible |

## Configuring Shortcuts

---

You can customize keyboard shortcuts by configuring the keymap in the editor setup:

```typescript
import { blockquoteKeymap, commonmark } from "@milkdown/kit/preset/commonmark";

Editor.make()
  .config((ctx) => {
    ctx.set(blockquoteKeymap.key, {
      WrapInBlockquote: "Mod-Shift-b",
      // or you may want to bind multiple keys:
      WrapInBlockquote: ["Mod-Shift-b", "Mod-b"],
    });
  })
  .use(commonmark);
```

## Defining Keymaps

---

Keymaps in Milkdown are defined using the `$useKeymap` utility. Here's how to define keymaps for different features:

### Heading Keymap Example

```typescript
import { $useKeymap } from "@milkdown/utils";
import { commandsCtx } from "@milkdown/core";

export const headingKeymap = $useKeymap("headingKeymap", {
  TurnIntoH1: {
    shortcuts: "Mod-Alt-1",
    command: (ctx) => {
      const commands = ctx.get(commandsCtx);
      return () => commands.call(wrapInHeadingCommand.key, 1);
    },
  },
  TurnIntoH2: {
    shortcuts: "Mod-Alt-2",
    command: (ctx) => {
      const commands = ctx.get(commandsCtx);
      return () => commands.call(wrapInHeadingCommand.key, 2);
    },
  },
  // ... more heading levels
  DowngradeHeading: {
    shortcuts: ["Delete", "Backspace"],
    command: (ctx) => {
      const commands = ctx.get(commandsCtx);
      return () => commands.call(downgradeHeadingCommand.key);
    },
  },
});
```

### Strong (Bold) Keymap Example

```typescript
import { $useKeymap } from "@milkdown/utils";
import { commandsCtx } from "@milkdown/core";

export const strongKeymap = $useKeymap("strongKeymap", {
  ToggleBold: {
    shortcuts: ["Mod-b"],
    command: (ctx) => {
      const commands = ctx.get(commandsCtx);
      return () => commands.call(toggleStrongCommand.key);
    },
  },
});
```

### Keymap Structure

Each keymap definition follows this structure:

```typescript
$useKeymap('keymapName', {
  CommandName: {
    shortcuts: string | string[],  // Single shortcut or array of shortcuts
    command: (ctx) => () => {      // Command to execute
      const commands = ctx.get(commandsCtx);
      return () => commands.call(commandKey, ...args);
    },
  },
});
```

## Creating Custom Shortcuts

---

If you need to add custom shortcuts, you can create a keymap plugin:

```typescript
import { $useKeymap } from "@milkdown/utils";
import { commandsCtx } from "@milkdown/core";

const customKeymap = $useKeymap("customKeymap", {
  CustomCommand: {
    shortcuts: "F1",
    command: (ctx) => {
      const commands = ctx.get(commandsCtx);
      return () => commands.call(someCommand.key);
    },
  },
});

// Usage
Editor.make().use(customKeymap).use(commonmark);
```

### Example: Custom Command with Shortcut

```typescript
import { $command, $useKeymap } from "@milkdown/utils";
import { commandsCtx } from "@milkdown/core";

// Create a custom command
const customCommand = $command("CustomCommand", (ctx) => () => {
  return (state, dispatch) => {
    // Command implementation
    return true;
  };
});

// Create a keymap
const customKeymap = $useKeymap("customKeymap", {
  CustomCommand: {
    shortcuts: ["F1", "Mod-F1"], // Multiple shortcuts
    command: (ctx) => {
      const commands = ctx.get(commandsCtx);
      return () => commands.call(customCommand.key);
    },
  },
});

// Usage
Editor.make().use(customCommand).use(customKeymap);
```
