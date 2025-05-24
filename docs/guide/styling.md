# Styling Guide

Milkdown is a headless editor, which means it doesn't come with any default styles. This gives you complete control over the appearance of your editor. You can either use existing themes or create your own custom styling solution.

# Styling Crepe Theme

---

Crepe is a collection of themes for Milkdown that provides both light and dark variants. The theme structure is organized as follows:

```
theme/
├── common/         # Shared styles and utilities
├── crepe/          # Light theme variant
├── crepe-dark/     # Dark theme variant
├── frame/          # Frame theme (light)
├── frame-dark/     # Frame theme (dark)
├── nord/           # Nord theme (light)
└── nord-dark/      # Nord theme (dark)
```

## Using Crepe Theme

To use the Crepe theme in your project:

```ts
// Import base styles first
import "@milkdown/crepe/theme/common/style.css";

// Choose the theme you want to use
import "@milkdown/crepe/theme/crepe.css";
```

## Theme Variables

Crepe theme uses CSS variables for consistent styling. Here are all the available variables:

### Colors

```css
.milkdown {
  /* Background Colors */
  --crepe-color-background: #fffdfb; /* Main background color */
  --crepe-color-surface: #fff8f4; /* Surface color for cards/panels */
  --crepe-color-surface-low: #fff1e5; /* Lower surface color for depth */

  /* Text Colors */
  --crepe-color-on-background: #1f1b16; /* Text color on background */
  --crepe-color-on-surface: #201b13; /* Text color on surface */
  --crepe-color-on-surface-variant: #4f4539; /* Secondary text color */

  /* Accent Colors */
  --crepe-color-primary: #805610; /* Primary brand color */
  --crepe-color-secondary: #fbdebc; /* Secondary accent color */
  --crepe-color-on-secondary: #271904; /* Text color on secondary */

  /* UI Colors */
  --crepe-color-outline: #817567; /* Border/outline color */
  --crepe-color-inverse: #362f27; /* Inverse color for contrast */
  --crepe-color-on-inverse: #fcefe2; /* Text color on inverse */
  --crepe-color-inline-code: #ba1a1a; /* Inline code color */
  --crepe-color-error: #ba1a1a; /* Error state color */

  /* Interactive Colors */
  --crepe-color-hover: #f9ecdf; /* Hover state color */
  --crepe-color-selected: #ede0d4; /* Selected state color */
  --crepe-color-inline-area: #e4d8cc; /* Inline editing area color */
}
```

### Typography

```css
.milkdown {
  /* Font Families */
  --crepe-font-title: Georgia, Cambria, "Times New Roman", Times, serif;
  --crepe-font-default: "Open Sans", Arial, Helvetica, sans-serif;
  --crepe-font-code:
    Fira Code, Menlo, Monaco, "Courier New", Courier, monospace;
}
```

### Shadows

```css
.milkdown {
  /* Small Shadow */
  --crepe-shadow-1:
    0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3);
  /* Large Shadow */
  --crepe-shadow-2:
    0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3);
}
```

## Customizing Crepe Theme

You can customize the Crepe theme by overriding its variables:

```css
/* custom-overrides.css */
.crepe .milkdown {
  /* Override colors */
  --crepe-color-primary: #your-primary-color;
  --crepe-color-background: #your-background-color;

  /* Override typography */
  --crepe-font-default: "Your Font", sans-serif;

  /* Override shadows */
  --crepe-shadow-1: your-shadow-value;
}
```

# Styling Milkdown

---

## Basic Styling

The editor is rendered within a container that has the class `.milkdown`, and the editable content area is wrapped in a container with the class `.editor`. You can use these classes to scope your styles:

```css
/* Basic styling example */
.milkdown .editor {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.milkdown .editor p {
  margin: 1rem 0;
  line-height: 1.6;
}
```

## Node and Mark Classes

Milkdown provides default class names for each node and mark. Here are some common examples:

```css
/* Paragraph styling */
.milkdown .editor .paragraph {
  margin: 1rem 0;
}

/* Heading styling */
.milkdown .editor .heading {
  font-weight: 600;
  margin: 1.5rem 0 1rem;
}

/* List styling */
.milkdown .editor .bullet-list {
  padding-left: 1.5rem;
}

.milkdown .editor .ordered-list {
  padding-left: 1.5rem;
}
```

## Custom Attributes

You can add custom attributes to nodes and marks, which is particularly useful when working with CSS frameworks like Tailwind CSS.

```typescript
import { Editor, editorViewOptionsCtx } from "@milkdown/kit/core";
import {
  commonmark,
  headingAttr,
  paragraphAttr,
} from "@milkdown/kit/preset/commonmark";

Editor.make()
  .config((ctx) => {
    // Add attributes to the editor container
    ctx.update(editorViewOptionsCtx, (prev) => ({
      ...prev,
      attributes: {
        class: "milkdown-editor mx-auto outline-hidden",
        spellcheck: "false",
      },
    }));

    // Add attributes to nodes and marks
    ctx.set(headingAttr.key, (node) => {
      const level = node.attrs.level;
      return {
        class: `heading-${level} font-bold`,
        "data-level": level,
      };
    });

    ctx.set(paragraphAttr.key, () => ({
      class: "text-base leading-relaxed",
    }));
  })
  .use(commonmark);
```

# Best Practices

---

1. **Use CSS Variables**: Define your theme's colors and spacing using CSS variables for easy customization.
2. **Responsive Design**: Ensure your editor styles work well on different screen sizes.
3. **Dark Mode Support**: Consider adding dark mode support using CSS variables and media queries.
4. **Accessibility**: Maintain good contrast ratios and readable font sizes.
5. **Performance**: Keep your CSS selectors specific and avoid overly complex rules.

For more examples and inspiration, check out:

- [@milkdown/theme-nord](https://github.com/Milkdown/milkdown/tree/main/packages/theme-nord)
- [@milkdown/crepe/theme](https://github.com/Milkdown/milkdown/tree/main/packages/crepe/src/theme)
