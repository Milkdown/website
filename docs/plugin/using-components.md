# Using Components

Components are feature-rich node views built on top of Milkdown's plugin system.
Each component is a separate module that you can import from `@milkdown/kit/component/*`.
All components can be used just like plugins.

```ts
import { imageBlockComponent } from '@milkdown/kit/component/image-block'
import { Editor } from '@milkdown/kit/core'

Editor.make().use(/* some other plugins */).use(imageBlockComponent).create()
```

Components are designed to be headless — they provide interactive functionality without enforcing specific styles. You have full control over the appearance via CSS. Components can be used in any framework.

## Configuring Components

Each component exposes a config context key that you can use to customize its behavior. For example, configuring the image block component:

```ts
import {
  imageBlockComponent,
  imageBlockConfig,
} from '@milkdown/kit/component/image-block'

Editor.make()
  .config((ctx) => {
    ctx.update(imageBlockConfig.key, (prev) => ({
      ...prev,
      onUpload: async (file) => {
        // Upload the file and return the URL
        const url = await uploadFile(file)
        return url
      },
    }))
  })
  .use(imageBlockComponent)
  .create()
```

Each component's config options are documented in their respective API pages below.

---

# List of Components

| Name                                             | Description                                                                                                             |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| [Code Block](/docs/api/component-code-block)     | Code editor powered by [CodeMirror](https://codemirror.net/) with syntax highlighting, language picker, and copy button |
| [Image Block](/docs/api/component-image-block)   | Block-level image with upload support, resizing, and caption editing                                                    |
| [Image Inline](/docs/api/component-image-inline) | Inline image with placeholder and uploader features                                                                     |
| [Link Tooltip](/docs/api/component-link-tooltip) | Floating tooltip for links with preview and edit modes                                                                  |
| [List Item](/docs/api/component-list-item-block) | Custom renderer for bullet, ordered, and task lists with checkbox support                                               |
| [Table Block](/docs/api/component-table-block)   | Interactive table with row/column operations, alignment controls, and drag handles                                      |
