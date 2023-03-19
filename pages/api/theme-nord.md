# @milkdown/theme-nord

Nord theme is a light weight theme built on top of [Nord](https://www.nordtheme.com/) and [tailwindcss](https://tailwindcss.com/).

This theme is designed to be used in milkdown's documentation website.
If you want to use it in your own project, you need to follow the steps below:

1. Install [tailwindcss](https://tailwindcss.com/) in your project.

2. Install [@tailwindcss/typography plugin](https://tailwindcss.com/docs/typography-plugin) and enable it.

3. Import `@milkdown/theme-nord` by following code:

```ts
/* Copyright 2021, Milkdown by Mirone. */
import { nord } from '@milkdown/theme-nord'

// Don't forget to import the css file.
import '@milkdown/theme-nord/style.css'

Editor
  .make()
  .use(nord)
  // ...
  .create()
```

@nord
The theme config you need to pass to the editor.
