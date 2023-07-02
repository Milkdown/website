# Understanding Headless Slash Plugin

In the old Milkdown versions. The slash plugin can be used to display a list of commands when users type `/` in the editor.
It provides a way to insert nodes and commands into the editor, and it's really easy to use.

![legacy slash plugin](/blogs/understanding-headless-slash-plugin/legacy-slash-plugin.png)

However, it's hard to extend the slash plugin to support more commands, or if you want to change the UI of the slash plugin, you have to rewrite the whole plugin.
But, write a new plugin is always a hard work. You have to understand a lot of context and APIs of both ProseMirror and Milkdown.

## User Story

So, why don't we provide the slash plugin as a headless plugin?
In most cases, developers just want to make sure that when users type a special character, a dropdown menu will be displayed.
But the trigger character and the UI of the dropdown menu are different in different cases.

For example:

* When user type `/`, the menu contains a list of **commands**.
* When user type `:`, the menu contains a list of **emoji**.
* When user type `@`, the menu contains a list of **users**.

That's the story behind the headless slash plugin. We provide the plugin to solve a single problem: **display a dropdown menu when users input satisfy a condition**.


## How to use

In the new slash plugin, you'll need to control when to display the dropdown menu by yourself.
And you'll also need to provide the UI of the dropdown menu.
So, you'll need to create a `SlashProvider` instance.

```ts
import {slashPlugin, SlashProvider} from '@milkdown/plugin-slash';

const slashProvider = new SlashProvider({
  content: YourDropdownUI,
  shouldShow(this: SlashProvider, view: EditorView) {
    const currentText = this.getContent(view);

    if (currentText === '') {
      return false;
    }

    // Display the menu if the last character is `/`.
    if (currentText.endsWith('/')) {
      return true;
    }

    return false;
  }
})
```

Then, you can use the slash provider in your plugin view.

```ts
import {EditorState} from "@milkdown/prose/state";
import {EditorView, PluginView} from '@milkdown/prose/view';

function yourSlashView(): PluginView {
  return {
    update: (view: EditorView, prevState: EditorState) => {
      slashProvider.update(view, prevState);
    },
    destroy: () => {
      slashProvider.destroy();
    }
  }
}
```

Last, you'll need to add the slash plugin to your editor.

```ts
import { Editor } from '@milkdown/core';
import { slashFactory } from '@milkdown/plugin-slash';

const slash = slashFactory('my-slash');

Editor
  .make()
  .config((ctx) => {
    ctx.set(slash.key, {
      view: slashPluginView
    })
  })
  .use(slash)
  .create();
```

## Use with Prosemirror Adapter

If you're using milkdown with UI frameworks like React,
I recommend you to use the [Prosemirror Adapter](https://github.com/Saul-Mirone/prosemirror-adapter).
It can help you build prosemirror UI components with your favorite UI framework.

For example, if you're using React:

```tsx
import { SlashProvider } from "@milkdown/plugin-slash";
import { useInstance } from "@milkdown/react";
import { usePluginViewContext } from "@prosemirror-adapter/react";

export const DropdownMenu = () => {
  const { view, prevState } = usePluginViewContext();
  const slashProvider = useRef<SlashProvider>();
  const divRef = useRef<HTMLDivElement>(null);
  const [loading] = useInstance();

  useEffect(() => {
    if (!ref.current || loading) return;

    slashProvider.current ??= new SlashProvider({
      content: divRef.current
      // ...
    });

    return () => {
      slashProvider.current?.destroy();
      slashProvider.current = undefined;
    };
  }, [loading, root, setOpened, setSearch, setSelected]);

  useEffect(() => {
    slashProvider.current?.update(view, prevState);
  });

  // Add a wrapper `div` to hide the dropdown menu when initializing.
  return (
    <div className="hidden">
      <div role="tooltip" ref={divRef}>
        <h1>Hi! I'm a dropdown menu.</h1>
      </div>
    </div>
  );
};
```

And in your editor component:

```ts
import { usePluginViewFactory } from "@prosemirror-adapter/react";

export const YourEditor = () => {
  const pluginViewFactory = usePluginViewFactory();

  useEditor((editor) => {
      return Editor.make()
        .config((ctx) => {
          ctx.set(slash.key, {
            view: pluginViewFactory({
              component: DopdownMenu,
            })
          })
        })
        .use(slash)
  })

  // ...
}
```

## Real World Example

In [milkdown playground](/playground), you can type `/` to display a dropdown menu.

![command dropdown](/blogs/understanding-headless-slash-plugin/command-dropdown.png)

You can also type `:(\S)+` (for example: `:mil`) to display a list of emojis.

![emoji dropdown](/blogs/understanding-headless-slash-plugin/emoji-dropdown.png)

You can find the source code of them in [Milkdown website](https://github.com/Milkdown/website).
I hope you enjoy the new slash plugin.
