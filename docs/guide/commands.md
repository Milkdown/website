# Commands

Sometimes we want to make some changes to editor content programmatically, such as click a button to toggle our selection to italic style.
We provide users with a command manager that has lots of commands defined for use in presets and plugins.

## Run a Command

We can use **command key** to run commands with command manager.

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

## Create a Command

To create a command, you should use `$command` in @milkdown/utils.
The command should be a [prosemirror command](https://prosemirror.net/docs/guide/#commands).

### Example: Command without argument

We create a command in the next example:

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

We can also add a info argument for commands:

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
