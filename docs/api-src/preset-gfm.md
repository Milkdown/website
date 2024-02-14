# @milkdown/preset-gfm

Github flavored markdown preset for [milkdown](https://milkdown.dev/).

> Notice: The GFM preset needs to be used with the [commonmark preset](https://milkdown.dev/api/preset-commonmark).

```typescript
import { Editor } from '@milkdown/core';

import { commonmark } from '@milkdown/preset-commonmark';
import { gfm } from '@milkdown/preset-gfm';

Editor
  .make()
  .use(commonmark)
  .use(gfm)
  .create();
```

@gfm

---

# Table

@tableSchema
@tableRowSchema
@tableHeaderSchema
@tableCellSchema

@insertTableInputRule
@tableKeymap

## Commands

@goToPrevTableCellCommand
@goToNextTableCellCommand
@breakTableCommand
@insertTableCommand
@moveRowCommand
@moveColCommand
@selectRowCommand
@selectColCommand
@selectTableCommand
@deleteSelectedCellsCommand
@addColBeforeCommand
@addColAfterCommand
@addRowBeforeCommand
@addRowAfterCommand
@setAlignCommand

## Table Utils

@findTable
@getCellsInCol
@getCellsInRow
@getAllCellsInTable
@selectCol
@selectRow
@selectTable
@moveCol
@moveRow

## Prosemirror Plugins
@autoInsertZeroSpaceInTablePlugin
@columnResizingPlugin
@tableEditingPlugin

---

# Task List

@extendListItemSchemaForTask
@wrapInTaskListInputRule

---

# Strike Through

@strikethroughAttr
@strikethroughSchema
@toggleStrikethroughCommand
@strikethroughKeymap
@strikethroughInputRule

---

# Footnote

@footnoteDefinitionSchema
@footnoteReferenceSchema

---

# Others

@remarkGFMPlugin
@markInputRules
