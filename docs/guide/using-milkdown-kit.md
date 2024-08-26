# Using @milkdown/kit

Milkdown provides a set of utilities to help you build your editor.
These utilities are re-exported from the `@milkdown/kit` package.
Thus, you don't need to install the common dependencies manually like `@milkdown/prose`, `@milkdown/core` or `@milkdown/preset-common` in your project.

## What's included

`@milkdown/kit` re-exports the following packages:

| Package                                                    | Import path                               | Scope     |
|------------------------------------------------------------|-------------------------------------------|-----------|
| [@milkdown/core](/docs/api/core)                           | `@milkdown/kit/core`                      | Framework |
| [@milkdown/ctx](/docs/api/ctx)                             | `@milkdown/kit/ctx`                       | Framework |
| [@milkdown/prose](/docs/guide/prosemirror-api)             | `@milkdown/kit/prose`                     | Framework |
| [@milkdown/prose/*](/docs/guide/prosemirror-api)           | `@milkdown/kit/prose/*`                   | Framework |
| [@milkdown/transformer](/docs/api/transformer)             | `@milkdown/kit/transformer`               | Framework |
| [@milkdown/utils](/docs/api/utils)                         | `@milkdown/kit/utils`                     | Framework |
| [@milkdown/preset-commonmark](/docs/api/preset-commonmark) | `@milkdown/kit/preset/commonmark`         | Preset    |
| [@milkdown/preset-gfm](/docs/api/preset-gfm)               | `@milkdown/kit/preset/gfm`                | Preset    |
| [@milkdown/plugin-block](/docs/api/plugin-block)           | `@milkdown/kit/plugin/block`              | Plugin    |
| [@milkdown/plugin-clipboard](/docs/api/plugin-clipboard)   | `@milkdown/kit/plugin/clipboard`          | Plugin    |
| [@milkdown/plugin-cursor](/docs/api/plugin-cursor)         | `@milkdown/kit/plugin/cursor`             | Plugin    |
| [@milkdown/plugin-history](/docs/api/plugin-history)       | `@milkdown/kit/plugin/history`            | Plugin    |
| [@milkdown/plugin-indent](/docs/api/plugin-indent)         | `@milkdown/kit/plugin/indent`             | Plugin    |
| [@milkdown/plugin-listener](/docs/api/plugin-listener)     | `@milkdown/kit/plugin/listener`           | Plugin    |
| [@milkdown/plugin-slash](/docs/api/plugin-slash)           | `@milkdown/kit/plugin/slash`              | Plugin    |
| [@milkdown/plugin-tooltip](/docs/api/plugin-tooltip)       | `@milkdown/kit/plugin/tooltip`            | Plugin    |
| [@milkdown/plugin-trailing](/docs/api/plugin-trailing)     | `@milkdown/kit/plugin/trailing`           | Plugin    |
| [@milkdown/plugin-upload](/docs/api/plugin-upload)         | `@milkdown/kit/plugin/upload`             | Plugin    |
| @milkdown/component                                        | `@milkdown/kit/component`                 | Component |
| @milkdown/component/code-block                             | `@milkdown/kit/component/code-block`      | Component |
| @milkdown/component/image-block                            | `@milkdown/kit/component/image-block`     | Component |
| @milkdown/component/image-inline                           | `@milkdown/kit/component/image-inline`    | Component |
| @milkdown/component/link-tooltip                           | `@milkdown/kit/component/link-tooltip`    | Component |
| @milkdown/component/list-item-block                        | `@milkdown/kit/component/list-item-block` | Component |
| @milkdown/component/table-block                            | `@milkdown/kit/component/table-block`     | Component |
