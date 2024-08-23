# @milkdown/plugin-cursor

Add [drop cursor](https://github.com/ProseMirror/prosemirror-dropcursor) and
[gap cursor](https://github.com/ProseMirror/prosemirror-gapcursor) support.

## Usage

```typescript
import { Editor } from '@milkdown/kit/core';
import { commonmark } from '@milkdown/kit/preset/commonmark';
import { nord } from '@milkdown/theme-nord';

import { cursor } from '@milkdown/kit/plugin/cursor';

Editor.make().use(nord).use(commonmark).use(cursor).create();
```

@cursor

## Plugins

@dropCursorConfig
@dropCursorPlugin

@gapCursorPlugin
