# Introducing Milkdown@7

It's been almost one year since the release of [milkdown](https://milkdown.dev) V6.
It helped a lot of users to build their own markdown based applications.
It has 13k downloads per month and I feel so grateful that users like that.

However, we noticed that there're some problems cannot be resolved if we don't make a new major version.
What big changes did we made?  I'll introduce them to you in this blog.

## TL;DR

* The editor becomes a first-class headless component.

* Factory plugins are fully replaced by **composable plugins**.

* Runtime plugin toggling is supported.

* Universal widget plugins.

* Better Vue and React support.

* API documentation is provided.

## Why Headless?

In the past, milkdown had a lot of internal styles to make sure the editor can work out of box and the themes are easy to create.
However, I found it limits the users to design their own editor.
Even worse, if you have an well designed application,
it is really hard to keep the style of the milkdown editor same with the rest of the application.
You'll need to override lots of styles everywhere.
It stops a log of users from using milkdown.

If we think about why users need an editor,
the most important thing is always the functionality of the editor.
Users just want a component that can provide smooth editing experience.
Style will always be the second thing.

So, why not remove all the internal styles and make the editor a headless component?
The users can easily integrate the editor into their own application.
They can use their own styles and even use their own components to render the editor.
We just care about the functionality of the editor. Make sure it works well.

## Composable Plugins

Although the composable plugins have been existed in milkdown for a long time,
we use factory plugins to create most of the official plugins in V6.

But, the problem is that factory plugins limit the possibility of the plugins.
The factory plugins handle a bunch of complex logic and it is hard to extend.
So for users who want to create a plugin in a easy way, they must follow the factory plugin's way.

```ts
const nodePlugin = createPlugin(() => ({
    id: 'node',
    schema: someSchema,
    inputRules: someInputRules
    commands: someCommands
}))
```

See? You can define a lot of things inside the factory plugin.
But if you want to use some part of them in another plugin, it's really hard to do that.

However, the milkdown's plugin system is designed to be flexible and composable.
We want to let users to control the data flow entirely.

So, we decided to remove all the factory plugins and use composable plugins to replace them.
The composable plugins can keep the atomicity of the plugins and make the plugin system more flexible.
They also make the plugin system easier to maintain.

```ts
const nodeSchema = $node('node', someSchema);
const nodeInputRules = $inputRules(someInputRules);
const nodeCommands = $commands(someCommands);
```

If you want to reuse them, it also will be very easy.

```ts
const anotherCommand = $commands(() => {
    return setBlockType(nodeSchema.type());
});
```

## Runtime Plugin Toggling

In the past, once you register a plugin, you cannot remove it.
In V7, we support runtime plugin toggling by providing two new API: `editor.remove` and `editor.removeConfig`.
They can let users remove the plugins and configs at runtime.

```ts
import { Editor } from '@milkdown/core';
import { someMilkdownPlugin } from 'some-milkdown-plugin';

const editor = await Editor
  .config(configForPlugin)
  .use(someMilkdownPlugin)
  .create();

// remove plugin
await editor.remove(someMilkdownPlugin);

// remove config
editor.removeConfig(configForPlugin);

// add another plugin
editor.use(anotherMilkdownPlugin)

// Recreate the editor to apply changes.
await editor.create();
```

Also, if you call the `editor.create` method after the editor is created,
it will recreate the editor and apply all the changes.

## Universal Widget Plugins

We have 4 official widget plugins in V6: *slash*, *tooltip*, *block* and *menu*.

They are all well designed and easy to use.
But if you want to customize them, what you can do is really limited.
Also, it's hard to reuse their logic even if you want to create something similar to them.
For example, if you want to create a mention plugin which will show a list of users when you type `@`,
you need to create a new plugin from scratch.

So, in V7, we make *slash*, *tooltip* and *block* plugins universal.
You can use them to build you features easily.
For example, if you want to create a mention plugin, you can use the new slash plugin to do that.
Another example is that you can also create tooltips for different types of nodes.
Display a tooltip with input when you focus on an image node, or display a tooltip with buttons when you select some text.

What about the *menu* plugin? We removed it because we think it's easy to create a menu plugin by yourself.
We've already done that in the [official playground](https://milkdown.dev/playground).
And, trust me, [it won't need much code](https://github.com/milkdown/website/blob/main/src/component/Playground/Milkdown/index.tsx#L57).

## Better Vue and React Support

Thanks to the [Saul-Mirone/prosemirror-adapter project](https://github.com/Saul-Mirone/prosemirror-adapter).
In milkdown V7. We allow users to use vue and react to render lots of parts of the editor.
For example, you can use them to render your own code block, drag handle or even small icons.

* React Example: [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Milkdown/examples/tree/main/react-custom-component)
* Vue Example: [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Milkdown/examples/tree/main/vue-custom-component)

## API Documentation

What's the hardest thing to do when maintaining an open source project?
Keep the documentation up to date.
Thanks to the [marijnh/builddocs project](https://github.com/marijnh/builddocs),
we can generate the API documentation automatically from the source code.

We also redesigned the documentation website, provide a more powerful playground and lots of examples.
