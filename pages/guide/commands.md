# Commands

Sometimes we want to make some changes to editor content programmatically, such as click a button to toggle selection to italic style.
We provide users a command manager with lots of commands defined in presets and plugins to use.

## Run a Command

We can use **command key** to run commands with command manager.

```typescript
import { Editor, commandsCtx } from '@milkdown/core';
import { commonmark, ToggleItalic } from '@milkdown/preset-commonmark';

async function setup() {
  const editor = await Editor.make().use(commonmark).create();

  const toggleItalic = () =>
    editor.action((ctx) => {
      // get command manager
      const commandManager = ctx.get(commandsCtx);

      // call command
      commandManager.call(ToggleItalic);
    });

  // get markdown string:
  $button.onClick = toggleItalic;
}
```

## Create a Command

To create a command, you should use `$command` in @milkdown/utils.
The command should be a [prosemirror command](https://prosemirror.net/docs/guide/#commands).

### Example: Command without argument

We create a command in the next example:

```typescript
import { blockquoteSchema } from '@milkdown/preset-commonmark';
import { $command, callCommand } from '@milkdown/utils';
import { wrapIn } from '@milkdown/prose/commands';

const wrapInBlockquoteCommand = $command('WrapInBlockquote', (ctx) => () => wrapIn(blockquoteSchema.type()))

// call command
editor.action(callCommand(wrapInBlockquoteCommand.key));
```

### Example: Command with argument

We can also add a info argument for commands:

```typescript
import { headingSchema } from '@milkdown/preset-commonmark';
import { $command, callCommand } from '@milkdown/utils';
import { setBlockType } from '@milkdown/prose/commands';

// use number as the type of argument
export const WrapInHeading = createCmdKey<number>();
const wrapInHeadingCommand = $command('WrapInHeading', (ctx) => (level = 1) => setBlockType(headingSchema.type(), { level }));

// call command
editor.action(callCommand(wrapInHeadingCommand.key)); // turn to h1 by default
editor.action(callCommand(wrapInHeadingCommand.key, 2)); // turn to h2
```
