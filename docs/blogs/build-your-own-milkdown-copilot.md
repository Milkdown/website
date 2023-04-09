# Build Your Own Milkdown Copilot

OpenAI introduced ChatGPT in 2020, which is a chatbot that can generate natural language responses to user input.
Which brings us a new way to interact with devices and applications.
Nowadays, there are more and more tools that are powered by AI. Such as Notion, GitHub and even Microsoft 365.

Since OpenAI also released the [API](https://openai.com/blog/openai-api) of it. And Milkdown is composed by plugins.
I think it's possible to build a Milkdown Copilot Plugin that can help you write documents. So I did it.
Let's see the result.

![Milkdown Copilot](/blogs/build-your-own-milkdown-copilot/milkdown-copilot.gif)

Looks cool, right? But how does it work? I'll explain it in the following sections.

## Prepare a Backend

**Before we start, you need to have a OpenAI API Key.** You'll need to get one [here](https://platform.openai.com/account/api-keys).
I'll not explain how to get it. You can find the details in their [official docs](https://platform.openai.com/).

I'll use Node.js to build the backend. You can use any language you like.
The backend is very simple. It just calls the OpenAI API and returns the result.

```ts
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  // Get your API key from env variable
  apiKey: process.env.OPENAPI_KEY,
});
const openai = new OpenAIApi(configuration);

export const handler = async (req, res, next) => {
  if (req.path === '/api/copilot' && req.method === "POST") {
    const buffers = [];

    // Get the body of the request.
    const body = JSON.parse(req.body)

    // Get prompt from the body.
    const { prompt } = body;
    const completion = await openai.createCompletion({
      // Pick a model you like
      model: "text-davinci-003",
      prompt,
    });
    const hint = completion.data.choices[0].text;
    return res.end(JSON.stringify({ hint }))
  }
  next()
  return;
}
```

We watch the `/api/copilot` route and call the OpenAI API when we receive a POST request.
The post request should contain a `prompt` field which is the text that we want to complete.

To call our API, we just need one single helper in browser environment:

```ts
async function fetchAIHint(prompt: string) {
  const data: Record<string, string> = { prompt }
  const response = await fetch('/api/copilot', {
    method: "POST",
    body: JSON.stringify(data)
  });
  const res = await response.json() as { hint: string };
  return res.hint;
}
```

## Build a Milkdown Plugin

Now let's focus on the Milkdown Copilot Plugin.

Basically I want to implement two things:

1. When the user types `<Enter>` or `<Space>`, they will get a hint from the copilot.
2. When the user types `<Tab>`, they will apply the content from the hint to the editor.

### Overview

To build a bridge between the copilot and the editor,
we can build a prosemirror plugin and use the `onKeyDown` hook to listen to the keydown event.

```ts
function keyDownHandler(ctx: Ctx, event: Event) {
  if (event.key === 'Enter' || event.code === 'Space') {
    getHint(ctx)
    return;
  }
  if (event.key === "Tab") {
    // prevent the browser from focusing on the next element.
    event.preventDefault();

    applyHint(ctx);
    return;
  }

  hideHint(ctx);
}
```

When the user types `<Enter>` or `<Space>`, we will call the `getHint` function to get a hint from the copilot.
And when the user types `<Tab>`, we will call the `applyHint` function to apply the hint to the editor.
If user types other keys, we will hide the hint.

And we also need a component to render the hint. Here I choose to use a simple [widget decoration in prosemirror](https://prosemirror.net/docs/ref/#view.Decoration^widget).

```ts
function renderHint(message: string) {
  const dom = document.createElement('pre');
  dom.className = "copilot-hint"
  dom.innerHTML = message;
  return dom;
}
```

So our component looks like:

```ts
import {$prose} from '@milkdown/utils';
import {Plugin, PluginKey} from '@milkdown/prose/state';
import {Decoration, DecorationSet} from "@milkdown/prose/view";

const initialState = {
  deco: DecorationSet.empty,
  message: '',
}

export const copilotPluginKey = new PluginKey('milkdown-copilot');
export const copilotPlugin = $prose((ctx) => new Plugin({
  key: copilotPluginKey,
  props: {
    handleKeyDwon(view, event) {
      keydownHandler(ctx, event);
    },
    decorations(state) {
      return copilotPluginKey.getState(state).deco;
    }
  },
  state: {
    init() {
      return {...initialState};
    },
    apply(tr, value, _prevState, state) {
      const message = tr.getMeta(copilotPluginKey);
      if (typeof message !== 'string') return value;

      if (message.length === 0) {
        return {...initialState};
      }

      const { to } = tr.selection;
      const widget = Decoration.widget(to + 1, () => renderHint(message))
      return {
        deco: DecorationSet.create(state.doc, [widget]),
        message,
      };
    }
  }
}))
```


### Get Hint

To get a hint from the copilot, we need to get the text before the cursor.

```ts
function getHint(ctx: Ctx) {
  const view = ctx.get(editorViewCtx);
  const {state} = view;
  const {tr,schema} = state;
  const {from} = tr.selection;

  const slice = tr.doc.slice(0, from)
  const serializer = ctx.get(serializerCtx);
  const doc = schema.topNodeType.createAndFill(undefined, slice.content);
  if (!doc) return;

  const markdown = serializer(doc);
  fetchAIHint(markdown).then((hint) => {
    const tr = view.state.tr;
    view.dispatch(tr.setMeta(copilotPluginKey, hint))
  });
}
```

1. First of all, we get the `selection` from the `state` of the editor.
2. Then we get a `slice` of the document from the start to the cursor.
3. Then we use the `serializer` to convert the slice to markdown.
4. After that, we call the `fetchAIHint` function to get a hint from the copilot.
5. Finally, we dispatch a transaction with the hint message we get to update the state of the editor.

### Hide Hint

To hide the hint, we just need to dispatch a transaction with an empty message.

```ts
function hideHint(ctx: Ctx) {
  const view = ctx.get(editorViewCtx);
  const {state} = view;
  const {tr} = state;
  view.dispatch(tr.setMeta(copilotPluginKey, ''))
}
```

### Apply Hint

Since we pass markdown to the OpenAI API. It may return a markdown snippet.

So, before we apply the hint to the editor, we need to convert the markdown snippet to prosemirror node.

```ts
function applyHint(ctx: Ctx) {
  const view = ctx.get(editorViewCtx);
  const {state} = view;
  const {tr,schema} = state;

  const {message} = copilotPluginKey.getState(state);
  const parser = ctx.get(parserCtx);
  const slice = parser(message);
  const dom = DOMSerializer.fromSchema(schema).serializeFragment(slice.content);
  const node = DOMParser.fromSchema(schema).parseSlice(dom);

  // Reset the hint since it's applied
  tr.setMeta(copilotPluginKey, '')
    // Replace the selection with the hint
    .replaceSelection(node)

  view.dispatch(tr);
}
```

1. First of all, we get the hint message from the state of the editor.
2. Then we use the `parser` to convert the markdown snippet to prosemirror node.
3. Finally, we dispatch a transaction to replace the selection with the hint.

## Conclusion

In this article, we have built a really simple Copilot plugin for Milkdown.
The plugin is not perfect, but it's a good start to help you build your own.

The source code is available on [Milkdown/examples/vanilla-openapi](https://github.com/Milkdown/examples/tree/main/vanilla-openai).
I hope it can give you some inspiration.
