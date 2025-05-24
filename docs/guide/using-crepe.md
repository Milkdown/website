# Using Crepe Editor

Crepe is a powerful, feature-rich Markdown editor built on top of Milkdown. It provides a complete editing experience with a beautiful UI and extensive customization options.

## Why Choose Crepe?

---

- 🚀 **Ready to Use**: Works out of the box with sensible defaults
- 🎨 **Beautiful UI**: Modern design with multiple theme options
- 🔧 **Highly Customizable**: Extensive configuration options
- 📦 **Feature Complete**: Includes all essential Markdown editing features
- 🛠️ **Extensible**: Built on Milkdown's plugin system

## Quick Start

---

### Installation

```bash
# Using npm
npm install @milkdown/crepe

# Using yarn
yarn add @milkdown/crepe

# Using pnpm
pnpm add @milkdown/crepe
```

### Basic Usage

```typescript
import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";

// Choose your preferred theme

// Create editor instance
const crepe = new Crepe({
  root: document.getElementById("app"),
  defaultValue: "# Hello, Crepe!\n\nStart writing your markdown...",
});

// Initialize the editor
await crepe.create();

// Clean up when done
crepe.destroy();
```

::iframe{src="https://stackblitz.com/github/Milkdown/examples/tree/main/editor-crepe"}

## Themes

---

Crepe comes with several beautiful themes out of the box:

### Light Themes

- `frame` - Modern frame-based design
- `classic` - Traditional editor look
- `nord` - Clean, minimal Nord color scheme

### Dark Themes

- `frame-dark` - Dark version of frame theme
- `classic-dark` - Dark version of classic theme
- `nord-dark` - Dark version of nord theme

To use a theme:

```typescript
// Import base styles first
import "@milkdown/crepe/theme/common/style.css";
// Then import your chosen theme
import "@milkdown/crepe/theme/frame.css";
```

### Custom Themes

You can create your own theme by extending the base styles. Check out the [existing themes](https://github.com/Milkdown/milkdown/tree/main/packages/crepe/src/theme) for reference.

## Features

---

Crepe includes a comprehensive set of features that can be enabled or disabled as needed.

### Feature Configuration

> **Note**: For any configuration that ends with `Icon` (like `boldIcon`, `linkIcon`, etc.), you can use either a string or an SVG element. This applies to all icon configurations throughout Crepe's features.

```typescript
const crepe = new Crepe({
  features: {
    // Disable specific features
    [Crepe.Feature.CodeMirror]: false,
    [Crepe.Feature.Table]: false,
  },
  featureConfigs: {
    // Configure feature behavior
    [Crepe.Feature.LinkTooltip]: {
      inputPlaceholder: "Enter URL...",
    },
  },
});
```

### Available Features

#### 1. Code Editor (`CodeMirror`)

Syntax highlighting and editing for code blocks with language support, theme customization, and preview capabilities.

#### 2. List Management (`ListItem`)

Support for bullet lists, ordered lists, and todo lists with customizable icons and formatting.

#### 3. Link Management (`LinkTooltip`)

Enhanced link editing and preview with customizable tooltips, edit/remove actions, and copy functionality.

#### 4. Image Handling (`ImageBlock`)

Image upload and management with resizing, captions, and support for both inline and block images.

#### 5. Block Editing (`BlockEdit`)

Drag-and-drop block management and slash commands for quick content insertion and organization.

#### 6. Table Support (`Table`)

Full-featured table editing with row/column management, alignment options, and drag-and-drop functionality.

#### 7. Toolbar (`Toolbar`)

Formatting toolbar for selected text with customizable icons and actions.

#### 8. Cursor (`Cursor`)

Enhanced cursor experience with drop cursor and gap cursor for better content placement.

#### 9. Placeholder (`Placeholder`)

Document or block level placeholders to guide users when content is empty.

#### 10. Latex (`Latex`)

Mathematical formula support with both inline and block math rendering using KaTeX.

For detailed configuration options of each feature, please refer to the [API documentation](/docs/api/crepe).

## Editor Instance Methods

---

#### `crepe.editor`

Access the underlying Milkdown editor instance.

```typescript
const editor = crepe.editor;
editor.use(customPlugin);
editor.action(insert("Hello"));
```

#### `crepe.create()`

Initialize the editor.

```typescript
await crepe.create();
```

#### `crepe.destroy()`

Clean up the editor instance.

```typescript
crepe.destroy();
```

#### `crepe.setReadonly(value: boolean)`

Toggle readonly mode.

```typescript
crepe.setReadonly(true); // Make editor read-only
crepe.setReadonly(false); // Make editor editable
```

#### `crepe.on`

Add event listeners.

```typescript
crepe.on((listener) => {
  listener.markdownUpdated((markdown) => {
    console.log("Markdown updated:", markdown);
  });

  listener.updated((doc) => {
    console.log("Document updated");
  });

  listener.focus(() => {
    console.log("Editor focused");
  });

  listener.blur(() => {
    console.log("Editor blurred");
  });
});
```

#### `crepe.getMarkdown()`

Get current markdown content.

```typescript
const markdown = crepe.getMarkdown();
```

## Next Steps

---

- Learn about [Milkdown's architecture](/docs/guide/architecture-overview)
- Explore [available plugins](/docs/plugin/using-plugins)
- Read the [API reference](/docs/api/crepe)