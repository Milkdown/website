# Example: Iframe Plugin

This guide demonstrates how to create a custom iframe syntax plugin for Milkdown. This plugin allows you to embed iframes directly in your markdown content using a simple directive syntax.

## Overview

---

The iframe plugin enables you to embed external web content using the following syntax:

```markdown
::iframe{src="https://example.com"}
```

This will render as an embedded iframe in your document.

## Implementation Steps

---

To create a custom syntax plugin in Milkdown, we need to implement five key components:

1. **Remark Plugin**: Parse the custom syntax
2. **Schema Definition**: Define the node structure
3. **Parser**: Convert markdown to ProseMirror nodes
4. **Serializer**: Convert ProseMirror nodes back to markdown
5. **Input Rules**: Handle user input

Let's implement each component:

## 1. Remark Plugin

---

First, we use the `remark-directive` plugin to support our custom syntax. This plugin allows us to define custom directives in markdown.

```typescript
import directive from "remark-directive";
import { $remark } from "@milkdown/kit/utils";

const remarkDirective = $remark("remarkDirective", () => directive);
```

## 2. Schema Definition

---

Next, we define the schema for our iframe node. The schema specifies how the node behaves and appears in the editor.

```typescript
import { $node } from "@milkdown/kit/utils";
import { Node } from "@milkdown/kit/prose/model";

const iframeNode = $node("iframe", () => ({
  group: "block", // Block-level node
  atom: true, // Cannot be split
  isolating: true, // Cannot be merged with adjacent nodes
  marks: "", // No marks allowed
  attrs: {
    src: { default: null }, // URL attribute
  },
  parseDOM: [
    {
      tag: "iframe",
      getAttrs: (dom) => ({
        src: (dom as HTMLElement).getAttribute("src"),
      }),
    },
  ],
  toDOM: (node: Node) => [
    "iframe",
    { ...node.attrs, contenteditable: false }, // Prevent editing iframe content
    0,
  ],
}));
```

## 3. Parser

---

The parser converts our markdown syntax into ProseMirror nodes. It looks for the `leafDirective` type with the name "iframe".

```typescript
parseMarkdown: {
  match: (node) => node.type === 'leafDirective' && node.name === 'iframe',
  runner: (state, node, type) => {
    state.addNode(type, { src: (node.attributes as { src: string }).src });
  },
},
```

## 4. Serializer

---

The serializer converts ProseMirror nodes back to markdown format.

```typescript
toMarkdown: {
  match: (node) => node.type.name === 'iframe',
  runner: (state, node) => {
    state.addNode('leafDirective', undefined, undefined, {
      name: 'iframe',
      attributes: { src: node.attrs.src },
    });
  },
},
```

## 5. Input Rules

---

Input rules handle user typing and convert the syntax into an iframe node.

```typescript
import { InputRule } from "@milkdown/kit/prose";
import { $inputRule } from "@milkdown/kit/utils";

const iframeInputRule = $inputRule(
  () =>
    new InputRule(
      /::iframe\{src\="(?<src>[^"]+)?"?\}/,
      (state, match, start, end) => {
        const [okay, src = ""] = match;
        const { tr } = state;
        if (okay) {
          tr.replaceWith(start - 1, end, iframeNode.type().create({ src }));
        }
        return tr;
      },
    ),
);
```

## Usage

---

To use the iframe plugin, add it to your Milkdown editor configuration:

```typescript
import { Editor } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";

Editor.make()
  .use([remarkDirective, iframeNode, iframeInputRule])
  .use(commonmark)
  .create();
```

## Example

---

Here's a complete example of the iframe plugin in action:

::iframe{src="https://stackblitz.com/github/Milkdown/examples/tree/main/vanilla-iframe-syntax"}
