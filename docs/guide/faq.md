# FAQ

This page lists answers to frequently asked questions.

---

### How can I change contents programmatically?

You should use `editor.action` to change the contents.
We provide two macros that allow you to change content in Milkdown, `insert` and `replaceAll`.

```typescript
import { insert, replaceAll } from '@milkdown/kit/utils'

const editor = await Editor.make()
  // .use(<All Your Plugins>)
  .create()

editor.action(insert('# New Heading'))

editor.action(replaceAll('# New Document'))
```

---

### How to configure remark?

```typescript
import { remarkStringifyOptionsCtx } from '@milkdown/kit/core'

editor.config((ctx) => {
  ctx.set(remarkStringifyOptionsCtx, {
    // some options, for example:
    bullet: '*',
    fences: true,
    incrementListMarker: false,
  })
})
```

---

### How to get the Markdown content from the editor?

If you are using Crepe:

```typescript
const markdown = editor.getMarkdown()
```

If you are using the Kit API:

```typescript
import { editorViewCtx, serializerCtx } from '@milkdown/kit/core'

const getMarkdown = (editor) =>
  editor.action((ctx) => {
    const serializer = ctx.get(serializerCtx)
    const view = ctx.get(editorViewCtx)
    return serializer(view.state.doc)
  })
```

---

### How to listen for content changes?

If you are using Crepe:

```typescript
editor.on((listener) => {
  listener.markdownUpdated((ctx, markdown, prevMarkdown) => {
    console.log('Content updated:', markdown)
  })
})
```

If you are using the Kit API, use the [listener plugin](/docs/api/plugin-listener):

```typescript
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener'

Editor.make()
  .config((ctx) => {
    ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
      console.log(markdown)
    })
  })
  .use(listener)
  .create()
```

---

### How to set the editor to read-only mode?

If you are using Crepe:

```typescript
editor.setReadonly(true)
```

If you are using the Kit API:

```typescript
import { editorViewOptionsCtx } from '@milkdown/kit/core'

editor.config((ctx) => {
  ctx.update(editorViewOptionsCtx, (prev) => ({
    ...prev,
    editable: () => false,
  }))
})
```

---

### How to focus the editor programmatically?

```typescript
import { editorViewCtx } from '@milkdown/kit/core'

editor.action((ctx) => {
  const view = ctx.get(editorViewCtx)
  view.focus()
})
```

---

### Why is ProseMirror imported from `@milkdown/kit/prose/*`?

Milkdown re-exports ProseMirror to ensure you use the same version as Milkdown internally. If you install `prosemirror-*` packages separately, you may end up with duplicate module instances, which can cause subtle and hard-to-debug issues. Always import from `@milkdown/kit/prose/*`. See [ProseMirror API](/guide/prosemirror-api) for the full list of available packages.

---

### How to use Milkdown with SSR frameworks (Next.js, Nuxt, etc.)?

Milkdown relies on DOM APIs and cannot run on the server. You need to ensure the editor is only initialized on the client side.

For Next.js (App Router):

```typescript
'use client'

import { useEffect, useRef } from 'react'
import { Crepe } from '@milkdown/crepe'

export default function EditorComponent() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const editor = new Crepe({ root: ref.current! })
    editor.create()
    return () => { editor.destroy() }
  }, [])

  return <div ref={ref} />
}
```

For Nuxt, use `<ClientOnly>` or `onMounted` to ensure the editor is created client-side only.

---

### How to destroy the editor properly?

Always destroy the editor when the component unmounts to avoid memory leaks:

```typescript
// Crepe
const editor = new Crepe({ root: '#editor' })
await editor.create()
// When done:
await editor.destroy()

// Kit API
const editor = await Editor.make().use(commonmark).create()
// When done:
await editor.destroy()
```

In React, use a cleanup function in `useEffect`. In Vue, use `onUnmounted`.
```
