# Using Crepe

Crepe editor is a well-designed an easy-to-use editor that built on top of Milkdown.

If you're new to Milkdown. Get started with Crepe is a good choice.
It works out of the box and provides a lot of features that you can use.
And you may also want to learn how to build your own editor from scratch with Milkdown by diving into the code.

# Getting Started

First, install the crepe package:

```bash
npm install @milkdown/crepe
```

Then, create the crepe editor.

```typescript
import { crepe } from '@milkdown/crepe';
import "@milkdown/crepe/theme/common/style.css";

// We have some themes for you to choose
import "@milkdown/crepe/theme/frame.css";

const crepe = new Crepe({
    root: document.getElementById('app'),
    defaultValue: 'Hello, Milkdown!',
});

crepe.create().then(() => {
  console.log('Editor created');
});

// To destroy the editor
crepe.destroy();
```

::iframe{src="https://stackblitz.com/github/Milkdown/examples/tree/main/editor-crepe"}

# Theme

Crepe provides following pure CSS themes for you to choose from:

- `frame`
- `classic`
- `nord`
- `frame-dark`
- `classic-dark`
- `nord-dark`

To use a theme, import the corresponding CSS file in your project.

```typescript
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
```

You can also create your own theme.
You may want to take a look at the [existing themes](https://github.com/Milkdown/milkdown/tree/main/packages/crepe/src/theme) to get started.

# Feature Toggle and Config

When creating the crepe editor, you can enable or disable some features by passing the `features` option.

```typescript
const crepe = new Crepe({
  features: {
    [Crepe.Feature.CodeMirror]: false,
  },
});
```

By default, all features are enabled.

For every feature, you can also customize the behavior by passing options to `featureConfigs`.

```typescript
const crepe = new Crepe({
  featureConfigs: {
    [Crepe.Feature.LinkTooltip]: {
      ...someOptions,
    }
  }
})
```

### `Crepe.Feature.CodeMirror`

CodeMirror will render code block with [CodeMirror](https://codemirror.net/).

- `extension`: CodeMirror extension to use. By default, crepe will load [basic setup](https://codemirror.net/docs/ref/#codemirror.basicSetup),
  [defaultKeymap](https://codemirror.net/docs/ref/#commands.defaultKeymap), [indentWithTab](https://codemirror.net/docs/ref/#commands.indentWithTab).
  You can load more extensions by this option.
- `theme`: CodeMirror theme to use. By default, crepe will use `nord` theme.
- `language`: CodeMirror language to use. By default, crepe will load [@codemirror/language-data](https://github.com/codemirror/language-data).
- `expandIcon`: Icon for expand language picker.
- `searchIcon`: Icon for search in language picker.
- `clearSearchIcon`: Icon for clear filter in language picker.
- `noResultText`: Text for no result in language picker.
- `renderLanguage`: Custom renderer for languages in language picker. For more details, see [renderLanguage](/docs/api/component-code-block#render-language).
- `renderPreview`: Custom renderer for preview in code block. For more details, see [renderPreview](/docs/api/component-code-block#render-preview).
- `previewToggleText`: Custom renderer for preview toggle button text in code block.
- `previewToggleIcon`: Custom renderer for preview toggle button icon in code block.
- `previewLabel`: Custom renderer for preview label in code block.

### `Crepe.Feature.ListItem`

List item with todo, bullet and ordered list.

- `bulletIcon`: Icon for bullet list item.
- `checkBoxCheckedIcon`: Icon for checked todo list item.
- `checkBoxUncheckedIcon`: Icon for unchecked todo list item.

### `Crepe.Feature.LinkTooltip`

Tooltip for preview and edit link.

- `linkIcon`: Icon for copy link in preview.
- `editButton`: Button for edit link in preview.
- `removeButton`: Button for delete link in preview.
- `confirmButton`: Button for confirm link in edit mode.
- `inputPlaceholder`: Placeholder for input in edit mode.
- `onCopyLink`: Callback when copy link button clicked.

### `Crepe.Feature.ImageBlock`

Render block as image with uploader, resizer and caption.

- `onUpload`: Callback when image chosen by file picker. For more details, see [onUpload](/docs/api/component-image-block#on-upload).
- `proxyDomURL`: Whether to proxy the image link to another URL when rendering. For more details, see [proxyDomURL](/docs/api/component-image-block#proxy-dom-url).

#### Inline Image Config

This config Will be passed to image inline components. See [inline image configuration](/docs/api/component-image-inline#configuration) for more details.

- `inlineImageIcon`: Icon for inline image.
- `inlineConfirmButton`: Button for confirm inline image.
- `inlineUploadButton`: Button for upload inline image.
- `inlineUploadPlaceholder`: Placeholder for inline image input.
- `inlineOnUpload`: Callback when image chosen by file picker, if not provided, it will use `onUpload`.

#### Block Image Config

This config will be passed to image block components. See [block image configuration](/docs/api/component-image-block#configuration) for more details.

- `blockImageIcon`: Icon for block image.
- `blockConfirmButton`: Button for confirm block image.
- `blockUploadButton`: Button for upload block image.
- `blockUploadPlaceholder`: Placeholder for block image input.
- `blockOnUpload`: Callback when image chosen by file picker, if not provided, it will use `onUpload`.
- `blockCaptionIcon`: Icon for toggle image block caption.
- `blockCaptionPlaceholder`: Placeholder for image block caption.

### `Crepe.Feature.BlockEdit`

Drag handle and block menu.

#### Drag Handle Config

- `handleAddIcon`: Icon for add block in block handle.
- `hadnleDragIcon`: Icon for drag block in block handle.

#### Slash Menu Config

##### Text Group

- `slashMenuTextGroupLabel`: Label for text group in slash menu.

######  paragraph
- `slashMenuTextIcon`: Icon for text in slash menu.
- `slashMenuTextLabel`: Label for text in slash menu.
-
###### heading
- `slashMenuH1Icon`: Icon for h1 in slash menu.
- `slashMenuH1Label`: Label for h1 in slash menu.
- `slashMenuH2Icon`: Icon for h2 in slash menu.
- `slashMenuH2Label`: Label for h2 in slash menu.
- `slashMenuH3Icon`: Icon for h3 in slash menu.
- `slashMenuH3Label`: Label for h3 in slash menu.
- `slashMenuH4Icon`: Icon for h4 in slash menu.
- `slashMenuH4Label`: Label for h4 in slash menu.
- `slashMenuH5Icon`: Icon for h5 in slash menu.
- `slashMenuH5Label`: Label for h5 in slash menu.
- `slashMenuH6Icon`: Icon for h6 in slash menu.
- `slashMenuH6Label`: Label for h6 in slash menu.

###### blockquote

- `slashMenuQuoteIcon`: Icon for blockquote in slash menu.
- `slashMenuQuoteLabel`: Label for blockquote in slash menu.

###### divider

- `slashMenuDividerIcon`: Icon for divider in slash menu.
- `slashMenuDividerLabel`: Label for divider in slash menu.

##### List Group

- `slashMenuListGroupLabel`: Label for list group in slash menu.

###### bullet

- `slashMenuBulletListIcon`: Icon for bullet list in slash menu.
- `slashMenuBulletListLabel`: Label for bullet list in slash menu.

###### ordered
  - `slashMenuOrderedListIcon`: Icon for ordered list in slash menu.
  - `slashMenuOrderedListLabel`: Label for ordered list in slash menu.
- todo
  - `slashMenuTaskListIcon`: Icon for todo list in slash menu.
  - `slashMenuTaskListLabel`: Label for todo list in slash menu.

##### Advanced Group

- `slashMenuAdvancedGroupLabel`: Label for advanced group in slash menu.
- image
  - `slashMenuImageIcon`: Icon for image in slash menu.
  - `slashMenuImageLabel`: Label for image in slash menu.
- code
  - `slashMenuCodeBlockIcon`: Icon for code in slash menu.
  - `slashMenuCodeBlockLabel`: Label for code in slash menu.
- table
  - `slashMenuTableIcon`: Icon for table in slash menu.
  - `slashMenuTableLabel`: Label for table in slash menu.

### `Crepe.Feature.Placeholder`

Doc or block level placeholder.

- `text`: Text displayed in the placeholder.
- `mode`: Should be `doc` or `block`. `doc` will display the placeholder only when the document is empty.
  `block` will display the placeholder when current block is empty.

### `Crepe.Feature.Table`

Table with row and column insertion, deletion and drag-and-drop.

- `addRowIcon`: Icon for add row in table.
- `addColIcon`: Icon for add column in table.
- `deleteRowIcon`: Icon for delete row in table.
- `deleteColIcon`: Icon for delete column in table.
- `alignLeftIcon`: Icon for align left in table.
- `alignCenterIcon`: Icon for align center in table.
- `alignRightIcon`: Icon for align right in table.
- `colDragHandleIcon`: Icon for drag column in table.
- `rowDragHandleIcon`: Icon for drag row in table.

### `Crepe.Feature.Toolbar`

Toolbar with buttons for formatting when selecting text.

- `boldIcon`: Icon for bold text.
- `italicIcon`: Icon for italic text.
- `codeIcon`: Icon for code text.
- `linkIcon`: Icon for link.
- `strikethroughIcon`: Icon for strikethrough text.

### `Crepe.Feature.Cursor`

Drop cursor and gap cursor.

- `color`: Color for drop cursor.
- `width`: Width for drop cursor.

### `Crepe.Feature.Latex`

Latex with math block and inline math.

- `katexOptions`: Options for [KaTeX](https://katex.org/).
- `inlineEditConfirm`: Icon for confirm inline latex changes.

# Methods

### `crepe.editor`

Get milkdown editor instance. You can use it interact with the editor.

```ts
const crepe = new Crepe({
  /* something */
});

// add plugin
crepe.editor.use(somePlugin);

await crepe.create();

import { insert } from '@milkdown/kit/utils';

crepe.editor.action(insert('some other thing'))
```

### `crepe.create()`

Create the editor. This method will return a promise that resolves when the editor is created.

```ts
crepe.create().then(() => {
  console.log('Editor created');
});
```

### `crepe.destroy()`

Destroy the editor. This method will remove the editor from the DOM and clean up the resources.

```ts
onBeforeUnmount(() => {
  crepe.destroy();
});
```

### `crepe.setReadonly(value: boolean)`

Set the readonly mode of the editor.

```ts
// set readonly
crepe.setReadonly(true);

// set editable
crepe.setReadonly(false);
```

### `crepe.on`

Add a listener to the editor.

It leverages the [listener plugin](/docs/api/plugin-listener) of Milkdown.

```ts
crepe.on(listener => {
  listener.markdownUpdated(onMarkdownUpdated);
  listener.updated(onDocUpdated);
  listener.focus(onFocus);
  listener.blur(onBlur);
  // ...
})
```

### `crepe.getMarkdown()`

Get the markdown content of the editor.

```ts
const markdown = crepe.getMarkdown();
```
