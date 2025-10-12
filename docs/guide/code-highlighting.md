# Code Highlighting

Milkdown supports syntax highlighting for code blocks through the `@milkdown/plugin-highlight` plugin. This plugin provides several options for highlighting code with different syntax highlighters.

## Installation

```bash
npm install @milkdown/plugin-highlight
```

## Basic Usage

The highlight plugin requires a parser to be configured. Here's a basic example using the Shiki parser:

```typescript
import { Editor } from '@milkdown/core'
import { commonmark } from '@milkdown/preset-commonmark'
import { highlight, highlightPluginConfig } from '@milkdown/plugin-highlight'
import { createParser } from '@milkdown/plugin-highlight/shiki'

const editor = Editor.make()
  .config(async (ctx) => {
    const parser = await createParser({
      theme: 'github-light',
      langs: ['javascript', 'typescript', 'python', 'html', 'css']
    })
    ctx.set(highlightPluginConfig.key, { parser })
  })
  .use(commonmark)
  .use(highlight)
  .create()
```

## Available Parsers

The plugin supports multiple syntax highlighting libraries:

### Shiki

Provides high-quality syntax highlighting with VS Code themes. Learn more at [Shiki](https://shiki.style/):

```typescript
import { createParser } from '@milkdown/plugin-highlight/shiki'

const parser = await createParser({
  theme: 'github-light',
  langs: ['javascript', 'typescript', 'python']
})
ctx.set(highlightPluginConfig.key, { parser })
```

### Lowlight

Based on [highlight.js](https://highlightjs.org/), supports many languages:

```typescript
import { createParser } from '@milkdown/plugin-highlight/lowlight'
import { common } from 'lowlight'

const parser = createParser({ common })
ctx.set(highlightPluginConfig.key, { parser })
```

Learn more about Lowlight at [lowlight](https://github.com/wooorm/lowlight).

### Refractor

Based on [Prism.js](https://prismjs.com/):

```typescript
import { createParser } from '@milkdown/plugin-highlight/refractor'
import { refractor } from 'refractor'

const parser = createParser({ refractor })
ctx.set(highlightPluginConfig.key, { parser })
```

Learn more about Refractor at [refractor](https://github.com/wooorm/refractor).

### Sugar High

A lightweight and fast syntax highlighter. Learn more at [Sugar High](https://github.com/huozhi/sugar-high):

```typescript
import { createParser } from '@milkdown/plugin-highlight/sugar-high'

const parser = createParser()
ctx.set(highlightPluginConfig.key, { parser })
```

## Styling

The highlighted code will have CSS classes applied based on the chosen parser. You'll need to include appropriate CSS to style the highlighted tokens.

### Sugar High Classes

Sugar High uses classes like:
- `sh__token--identifier`
- `sh__token--string`
- `sh__token--keyword`
- `sh__token--sign`
- `sh__token--property`

You can style these using CSS variables:

```css
.sh__token--identifier {
  color: var(--sh-identifier);
}
.sh__token--string {
  color: var(--sh-string);
}
.sh__token--keyword {
  color: var(--sh-keyword);
}
```

### Other Parsers

For Lowlight, Refractor, and Shiki, refer to their respective documentation for styling information.

## Example

Here's a complete example with Shiki:

```typescript
import { Editor } from '@milkdown/core'
import { commonmark } from '@milkdown/preset-commonmark'
import { highlight, highlightPluginConfig } from '@milkdown/plugin-highlight'
import { createParser } from '@milkdown/plugin-highlight/shiki'

async function createHighlightedEditor() {
  const parser = await createParser({
    theme: 'github-light',
    langs: ['javascript', 'typescript', 'python', 'html', 'css', 'json']
  })

  const editor = Editor.make()
    .config((ctx) => {
      ctx.set(highlightPluginConfig.key, { parser })
    })
    .use(commonmark)
    .use(highlight)

  await editor.create()
  return editor
}
```

With this setup, your code blocks will be automatically highlighted:

````markdown
```javascript
console.log('Hello, world!');
const greeting = (name) => `Hello, ${name}!`;
```
````

The code above will render with syntax highlighting applied to keywords, strings, and other language constructs.