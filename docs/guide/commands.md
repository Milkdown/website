# Commands

Commands are a powerful way to programmatically modify editor content. The command system in Milkdown provides a flexible and type-safe way to create, manage, and execute commands.

## Command Manager

---

The command manager is the central place for handling all editor commands. It provides methods to:

- Register new commands
- Execute commands
- Chain multiple commands together
- Handle command arguments

## Run a Command

---

You can execute commands using the command manager through the editor's action system:

```typescript
import { Editor, commandsCtx } from "@milkdown/kit/core";
import {
  commonmark,
  toggleEmphasisCommand,
} from "@milkdown/kit/preset/commonmark";

async function setup() {
  const editor = await Editor.make().use(commonmark).create();

  const toggleItalic = () =>
    editor.action((ctx) => {
      // get command manager
      const commandManager = ctx.get(commandsCtx);

      // call command
      commandManager.call(toggleEmphasisCommand.key);
    });

  // get markdown string:
  $button.onClick = toggleItalic;
}
```

## Command Chaining

---

You can chain multiple commands together using the command manager's `chain` method. Commands in the chain will be executed in order until one of them returns `true`:

```typescript
import { Editor, commandsCtx } from "@milkdown/kit/core";
import {
  commonmark,
  toggleEmphasisCommand,
  toggleStrongCommand,
} from "@milkdown/kit/preset/commonmark";

const editor = await Editor.make().use(commonmark).create();

editor.action((ctx) => {
  const commandManager = ctx.get(commandsCtx);

  // Chain multiple commands
  commandManager
    .chain()
    .pipe(toggleEmphasisCommand.key) // Try to toggle emphasis
    .pipe(toggleStrongCommand.key) // If emphasis fails, try to toggle strong
    .run();
});
```

You can also mix inline commands with registered commands:

```typescript
import { chainCommands } from "@milkdown/prose/commands";

editor.action((ctx) => {
  const commandManager = ctx.get(commandsCtx);

  commandManager
    .chain()
    .inline(someInlineCommand) // Add an inline command
    .pipe(toggleEmphasisCommand.key) // Add a registered command
    .run();
});
```

## Create a Command

---

To create a command, use the `$command` utility from `@milkdown/utils`. Commands should be [prosemirror commands](https://prosemirror.net/docs/guide/#commands).

### Example: Command without argument

```typescript
import { Editor } from "@milkdown/kit/core";
import { blockquoteSchema } from "@milkdown/kit/preset/commonmark";
import { wrapIn } from "@milkdown/kit/prose/commands";
import { $command, callCommand } from "@milkdown/kit/utils";

const wrapInBlockquoteCommand = $command(
  "WrapInBlockquote",
  (ctx) => () => wrapIn(blockquoteSchema.type(ctx)),
);

// register the command when creating the editor
const editor = Editor().make().use(wrapInBlockquoteCommand).create();

// call command
editor.action(callCommand(wrapInBlockquoteCommand.key));
```

### Example: Command with argument

Commands can accept arguments of any type:

```typescript
import { headingSchema } from "@milkdown/kit/preset/commonmark";
import { setBlockType } from "@milkdown/kit/prose/commands";
import { $command, callCommand } from "@milkdown/kit/utils";

// use number as the type of argument
export const WrapInHeading = createCmdKey<number>();
const wrapInHeadingCommand = $command(
  "WrapInHeading",
  (ctx) =>
    (level = 1) =>
      setBlockType(headingSchema.type(ctx), { level }),
);

// call command
editor.action(callCommand(wrapInHeadingCommand.key)); // turn to h1 by default
editor.action(callCommand(wrapInHeadingCommand.key, 2)); // turn to h2
```

### Example: Command with Multiple Arguments

```typescript
interface TableConfig {
  rows: number;
  cols: number;
  withHeader: boolean;
}

const insertTableCommand = $command(
  "InsertTable",
  (ctx) => (config: TableConfig) => {
    // Implementation for inserting a table
    return (state, dispatch) => {
      // ... table insertion logic
      return true;
    };
  },
);

// Usage
editor.action(
  callCommand(insertTableCommand.key, {
    rows: 3,
    cols: 3,
    withHeader: true,
  }),
);
```

## Best Practices

---

1. **Command Naming**

   - Use clear, descriptive names
   - Follow the pattern: `[Action][Target]Command`
   - Example: `toggleEmphasisCommand`, `insertTableCommand`

2. **Command Organization**

   - Group related commands together
   - Use namespaces for command keys
   - Keep commands focused and single-purpose

3. **Error Handling**

   - Always check if the command can be executed
   - Return `false` if the command cannot be executed
   - Handle edge cases gracefully

4. **Performance**

   - Keep commands lightweight
   - Avoid unnecessary state updates
   - Use command chaining for complex operations

5. **Type Safety**
   - Use TypeScript for command arguments
   - Define clear interfaces for command payloads
   - Use generics for type-safe command keys

## Common Patterns

---

### Toggle Commands

```typescript
const toggleCommand = $command(
  "ToggleFeature",
  (ctx) => () => (state, dispatch) => {
    const isActive = checkIfActive(state);
    return isActive
      ? removeFeature(state, dispatch)
      : addFeature(state, dispatch);
  },
);
```

### Insert Commands

```typescript
const insertCommand = $command(
  "InsertContent",
  (ctx) => (content: string) => (state, dispatch) => {
    const { selection } = state;
    if (!selection) return false;

    const tr = state.tr.insertText(content, selection.from);
    dispatch?.(tr);
    return true;
  },
);
```

### Transform Commands

```typescript
const transformCommand = $command(
  "TransformContent",
  (ctx) => (transform: (node: ProseNode) => ProseNode) => (state, dispatch) => {
    const { selection } = state;
    if (!selection) return false;

    const tr = state.tr.replaceWith(
      selection.from,
      selection.to,
      transform(state.doc.nodeAt(selection.from)!),
    );
    dispatch?.(tr);
    return true;
  },
);
```
