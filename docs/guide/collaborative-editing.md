# Collaborative Editing

Milkdown supports collaborative editing powered by [Y.js](https://docs.yjs.dev/).
We provide the [@milkdown/plugin-collab](/docs/api/plugin-collab) plugin to help you use milkdown with yjs easily.
This plugin includes basic collaborative editing features like:

- Sync between clients.
- Remote cursor support.
- Undo/Redo support.

::iframe{src="https://stackblitz.com/github/Milkdown/examples/tree/main/vanilla-collab"}

## Configure Plugin

First you need to install the plugin and yjs through npm:

```bash
npm install @milkdown/plugin-collab

npm install yjs y-protocols y-prosemirror
```

And you also need to choose a [provider for yjs](https://docs.yjs.dev/ecosystem/connection-provider), here we use [y-websocket](https://docs.yjs.dev/ecosystem/connection-provider/y-websocket) as an example.

After the installation, you can configure your editor:

```typescript
// ...import other plugins
import { collab, collabServiceCtx } from "@milkdown/plugin-collab";

async function setup() {
  const editor = await Editor.make()
    .config(nord)
    .use(commonmark)
    .use(collab)
    .create();

  const doc = new Doc();
  const wsProvider = new WebsocketProvider("<YOUR_WS_HOST>", "milkdown", doc);

  editor.action((ctx) => {
    const collabService = ctx.get(collabServiceCtx);

    collabService
      // bind doc and awareness
      .bindDoc(doc)
      .setAwareness(wsProvider.awareness)
      // connect yjs with milkdown
      .connect();
  });
}
```

Now your editor can support collaborative editing. Isn't it easy?

## Connect and Disconnect

You may want to control the connect status of the editor manually.

```typescript
editor.action((ctx) => {
  const collabService = ctx.get(collabServiceCtx);
  const doc = new Doc();
  const wsProvider = new WebsocketProvider("<YOUR_WS_HOST>", "milkdown", doc);

  collabService.bindDoc(doc).setAwareness(wsProvider.awareness);

  document.getElementById("connect").onclick = () => {
    wsProvider.connect();
    collabService.connect();
  };

  document.getElementById("disconnect").onclick = () => {
    wsProvider.disconnect();
    collabService.disconnect();
  };
});
```

## Default Template

By default, the editor will show a empty document. You may want to use a template to show a document.

```typescript
const template = `# Heading`;

editor.action((ctx) => {
  const collabService = ctx.get(collabServiceCtx);
  const doc = new Doc();
  const wsProvider = new WebsocketProvider("<YOUR_WS_HOST>", "milkdown", doc);

  collabService.bindDoc(doc).setAwareness(wsProvider.awareness);

  wsProvider.once("synced", async (isSynced: boolean) => {
    if (isSynced) {
      collabService
        // apply your template
        .applyTemplate(markdown)
        // don't forget connect
        .connect();
    }
  });
});
```

Keep in mind that applying a template multiple times may cause some unexpected behavior, such as duplicate content.
Because of this you need to make sure **the template is applied only once**.

By default, the template will only be applied if _document get from remote server is empty_.
You can control this behavior through passing second parameter to `applyTemplate`:

```typescript
collabService
  .applyTemplate(markdown, (remoteNode, templateNode) => {
    // return true to apply template
  })
  // don't forget connect
  .connect();
```

Here the nodes we get are [prosemirror nodes](https://prosemirror.net/docs/ref/#model.Node).
You should return `true` if the template should be applied, and `false` if not.
