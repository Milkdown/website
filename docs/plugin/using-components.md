# Using Components

Components are features work out of the box that built on top of plugins.
Each component is a separate module. You can use them by importing them from `@milkdown/kit/component/*`.
All components can be used just like plugins.

```ts
import { imageBlock } from '@milkdown/kit/component/image-block';
import { Editor } from '@milkdown/kit/core'

Editor
  .make()
  .use(/* some other plugins */)
  .use(imageBlock)
  .create();
```

Components are designed to be headless, which means they are not opinionated about the UI.
You can use them to build your own editor UI. Components are built by web components and can be used in any framework.

---

# List of Components

| Name                                              | Description                                                |
|---------------------------------------------------|------------------------------------------------------------|
| [Code Block](/docs/api/component-code-block)      | Render code by [Codemirror](https://codemirror.net/)       |
| [Image Block](/docs/api/component-image-block)    | Render an image as a block                                 |
| [Image Inline](/docs/api/component-image-inline)  | Provide placeholder and uploader features for inline image |
| [Link Tooltip](/docs/api/component-link-tooltip)  | Provide edit and preview feature for link                  |
| [List Item](/docs/api/component-list-item-block)  | Renderers bullet, ordered and task list by custom renderer |
| [Table Block](/docs/api/component-table-block)    | Render table and provides table editing features           |

