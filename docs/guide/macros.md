# Macros

Macros are helper functions that provide a convenient way to interact with the editor. They take a payload (or nothing) as parameters and return a callback function that takes the `ctx` of milkdown as a parameter. When called with `ctx`, they apply the specified action to the editor.

## Usage

There are two main ways to use macros:

```typescript
import { insert } from "@milkdown/kit/utils";
import { listenerCtx } from "@milkdown/plugin-listener";

// Method 1: Using editor.action()
editor.action(insert("# Hello Macro"));

// Method 2: Using listener
editor.config((ctx) => {
  ctx.get(listenerCtx).mounted(insert("# Default Title"));
});
```

## Available Macros

### Content Manipulation

#### `insert`

Inserts content at the current cursor position. The macro accepts two parameters:

- `markdown`: The markdown string to insert
- `inline`: Optional boolean flag (default: false) that determines how the content is inserted

```typescript
import { insert } from "@milkdown/kit/utils";

// Insert as block content (default)
editor.action(insert("# Hello World"));

// Insert as inline content
editor.action(insert("inline text", true));
```

The behavior differs based on the `inline` parameter:

- When `inline` is `false` (default):
  - Replaces the current selection with the parsed markdown content
  - Maintains the selection's open start/end positions
  - Scrolls the view to show the inserted content
- When `inline` is `true`:
  - Attempts to insert the content as inline text
  - If the content is text-only, replaces the selection with a text node
  - Otherwise, replaces the selection with the parsed content

#### `replaceAll`

Replaces all content in the editor. The macro accepts two parameters:

- `markdown`: The markdown string to replace the current content with
- `flush`: Optional boolean flag (default: false) that determines how the replacement is performed

```typescript
import { replaceAll } from "@milkdown/kit/utils";

// Replace content without flushing state
editor.action(replaceAll("# New Content"));

// Replace content and flush editor state
editor.action(replaceAll("# New Content", true));
```

The behavior differs based on the `flush` parameter:

- When `flush` is `false` (default):
  - Replaces the entire document content with the new markdown
  - Maintains the current editor state
  - More efficient for simple content replacements
- When `flush` is `true`:
  - Creates a new editor state with the new content
  - Reinitializes all plugins
  - Useful when you need a completely fresh editor state

### Content Retrieval

#### `getMarkdown`

Gets the current content as markdown.

```typescript
import { getMarkdown } from "@milkdown/kit/utils";

const markdown = editor.action(getMarkdown());
```

#### `getHTML`

Gets the current content as HTML.

```typescript
import { getHTML } from "@milkdown/kit/utils";

const html = editor.action(getHTML());
```

### Editor State

#### `forceUpdate`

Forces the editor to update its state.

```typescript
import { forceUpdate } from "@milkdown/kit/utils";

editor.action(forceUpdate());
```

#### `setAttr`

Sets attributes for a node at a specific position. The macro accepts two parameters:

- `pos`: The position of the node to update
- `update`: A function that takes the previous attributes and returns the new attributes

```typescript
import { setAttr } from "@milkdown/kit/utils";

// Update node attributes at position 10
editor.action(
  setAttr(10, (prevAttrs) => ({
    ...prevAttrs,
    class: "custom-class",
  })),
);

// Example: Update heading level
editor.action(
  setAttr(10, (prevAttrs) => ({
    ...prevAttrs,
    level: 2,
  })),
);
```

The macro:

- Takes a specific position in the document
- Retrieves the node at that position
- Applies the update function to modify the node's attributes
- Dispatches the changes to update the editor state

Note: The position must be valid and contain a node, otherwise the operation will be ignored.

### Navigation

#### `outline`

Gets the outline of the document.

```typescript
import { outline } from "@milkdown/kit/utils";

const docOutline = editor.action(outline());
```

### Command Execution

#### `callCommand`

Calls a registered command with optional payload. The macro has two overloads:

Examples:

```typescript
import { callCommand } from "@milkdown/kit/utils";
import { wrapInHeadingCommand } from "@milkdown/plugin-heading";

// Using command key
editor.action(callCommand(wrapInHeadingCommand.key, 1));

// With complex payload
editor.action(
  callCommand("CustomCommand", {
    type: "heading",
    level: 1,
    content: "New Heading",
  }),
);
```

The macro:

- Takes a command key
- Optionally accepts a payload parameter
- Returns a boolean indicating whether the command was successful

Note: The command must be registered in the editor's command context before it can be called.

## Examples

### Adding Content

```typescript
import { insert } from "@milkdown/kit/utils";
import { listenerCtx } from "@milkdown/plugin-listener";

editor.config((ctx) => {
  ctx.get(listenerCtx).mounted(insert("# Welcome\nStart editing..."));
});
```

### Saving Content

```typescript
import { getMarkdown } from "@milkdown/kit/utils";

editor.config((ctx) => {
  ctx.get(listenerCtx).updated(() => {
    const content = getMarkdown()(ctx);
    localStorage.setItem("editor-content", content);
  });
});
```

### Custom Command with Macro

```typescript
import { callCommand } from "@milkdown/kit/utils";

editor.action(
  callCommand("customCommand", {
    type: "heading",
    level: 1,
    content: "New Heading",
  }),
);
```

For more details about each macro's parameters and return types, check the [API Reference](/docs/api/utils#macros).
