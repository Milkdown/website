# Macros

Macros are helpers that specify how to handle a certain input and apply it to the editor.

Macros always take a payload (or nothing) as the parameters,
and return a callback function that takes the `ctx` of milkdown as parameter.
When you call this function with `ctx`, it will apply to the editor.

```typescript
import { insert } from "@milkdown/kit/utils";
// With listener
import { listenerCtx } from "@milkdown/plugin-listener";

// With action
editor.action(insert("# Hello Macro"));

editor.config((ctx) => {
  ctx.get(listenerCtx).mounted(insert("# Default Title"));
});
```

We have provided some built-in macros for you to use out of the box. You can check them out in the [API Reference](/docs/api/utils#macros).
