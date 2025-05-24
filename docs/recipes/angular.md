# Angular

We don't provide Angular support out of box, but you can use the vanilla version with it easily.

## Install the Dependencies

```bash
# install with npm
npm install @milkdown/kit
npm install @milkdown/theme-nord
```

## Create a Component

Create a component is pretty easy.

```html
<!-- editor.component.html -->
<div #editorRef></div>
```

```typescript
// editor.component.ts
import { Component, ElementRef, ViewChild } from "@angular/core";
import { defaultValueCtx, Editor, rootCtx } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { nord } from "@milkdown/theme-nord";

@Component({
  templateUrl: "./editor.component.html",
})
export class AppComponent {
  @ViewChild("editorRef") editorRef: ElementRef;

  defaultValue = "# Milkdown x Angular";

  ngAfterViewInit() {
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, this.editorRef.nativeElement);
        ctx.set(defaultValueCtx, this.defaultValue);
      })
      .config(nord)
      .use(commonmark)
      .create();
  }
}
```
