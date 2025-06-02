# Example: Iframe Plugin

Generally, if we want to add a custom syntax plugin, there are 5 things that need to be done:

1. **Add a remark plugin** to ensure the syntax can be parsed and serialized correctly.
2. **Define the ProseMirror schema** for your custom node.
3. **Write a parser specification** to transform the remark AST into a ProseMirror node.
4. **Write a serializer specification** to transform the ProseMirror node back into a remark AST.
5. **Write ProseMirror input rules** to ensure user input is handled correctly.

In this section, we will add a **custom iframe syntax** to insert an iframe as a node in Milkdown.

## Remark Plugin

---

First, we need a remark plugin to support our custom syntax. Remark provides a powerful [remark directive plugin](https://github.com/remarkjs/remark-directive) to support custom syntax. With this plugin, we can easily define an iframe using the following text:

```markdown
# My Iframe

::iframe{src="https://saul-mirone.github.io"}
```

This syntax allows us to embed an iframe directly into our markdown content.

## Define Schema

---

Next, we need to define the schema of an iframe node. Our iframe should be an inline node because it doesn't have any children, and it will have a `src` attribute to connect to the source.

```typescript
import { $node } from "@milkdown/kit/utils";

const iframeNode = $node("iframe", () => ({
  group: "block",
  atom: true,
  isolating: true,
  marks: "",
  attrs: {
    src: { default: null },
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
    { ...node.attrs, contenteditable: false },
    0,
  ],
}));
```

This schema defines how the iframe node should behave and be represented in the DOM.

## Connect to plugin(s)

---

Now that we have our basic node defined, we need to specify which remark plugins it requires to work.

```typescript
import { $remark } from "@milkdown/kit/utils";
import directive from "remark-directive";

const remarkPluginId = "...";
const remarkDirective = $remark(remarkPluginId, () => directive);
```

This code connects our custom node to the necessary remark plugins.

## Parser

---

Then, we need to add a parser specification to transform our markdown (in the form of a remark AST) to a ProseMirror node. You can use an inspect tool to find out the remark AST structure, but in this case, the iframe node has the following structure:

```typescript
const AST = {
  name: "iframe",
  attributes: { src: "https://saul-mirone.github.io" },
  type: "leafDirective",
};
```

So we can easily write our parser specification for it:

```typescript
parseMarkdown: {
  match: (node) => node.type === 'leafDirective' && node.name === 'iframe',
  runner: (state, node, type) => {
    state.addNode(type, { src: (node.attributes as { src: string }).src });
  },
},
```

This parser ensures that the custom iframe syntax is correctly interpreted and transformed into a ProseMirror node.

## Serializer

---

Then, we need to add a serializer specification to transform the ProseMirror node back to a remark AST:

```typescript
toMarkdown: {
  match: (node) => node.type.name === 'iframe',
  runner: (state, node) => {
    state.addNode('leafDirective', undefined, undefined, {
      name: 'iframe',
      attributes: { src: node.attrs.src },
    });
  },
}
```

This serializer ensures that the ProseMirror node can be serialized back into markdown format.

## Input Rule

---

For user input texts that should be transformed into an iframe, we also need to make it work. We can use `inputRules` to define [ProseMirror input rules](https://prosemirror.net/docs/ref/#inputrules) to implement this:

```typescript
import { InputRule } from "@milkdown/kit/prose";

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

This input rule allows users to type the custom syntax and have it automatically converted into an iframe node.

## Use Plugins

---

Finally, we need to add our new node type to the other nodes in the `AtomList`. We can then just `use` the plugin like we normally would:

```typescript
import { Editor } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { AtomList, createNode } from "@milkdown/kit/utils";

Editor.make()
  .use([remarkDirective, iframeNode, iframeInputRule])
  .use(commonmark)
  .create();
```

This code demonstrates how to integrate the custom iframe node into the Milkdown editor setup.

## Full Code

---

::iframe{src="https://stackblitz.com/github/Milkdown/examples/tree/main/vanilla-iframe-syntax"}

This example provides a complete setup for adding a custom iframe syntax to Milkdown, allowing for rich content embedding directly within markdown documents.
