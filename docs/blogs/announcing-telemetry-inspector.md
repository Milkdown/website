# Announcing Telemetry Inspector

There's a lot of questions from community asking that how can they know what plugins are enabled.
From Milkdown@7.2, we've added telemetries for milkdown, it can be available by inspectors.

With this API, you can inspect editor inner status.
You can even use visualizer to visualize the data. We create a simple example on [our playground](/playground).

![Milkdown Inspector](/blogs/announcing-telemetry-inspector/milkdown-inspector.gif)

## Get Started

Inspector will be a top-level API in Milkdown. You can use it like this:

```ts
import { Editor } from "@milkdown/core";
import { Telemetry } from "@milkdown/ctx";

const editor = await Editor.make()
  // Inspector is disabled by default considering performance. You need to enable it manually.
  .enableInspector()
  // ...
  .create();

const telemetry: Telemetry[] = editor.inspect();
```

The `Telemetry` interface will have the following fields:

```ts
interface Telemetry {
  // User defined information for the plugin.
  metadata: Meta;

  // The slices and their current value defined by the plugin.
  injectedSlices: { name: string; value: unknown }[];

  // The slices and their current value consumed by the plugin.
  consumedSlices: { name: string; value: unknown }[];

  // The timers and their duration defined by the plugin.
  recordedTimers: { name: string; duration: number; status: TimerStatus }[];

  // The timers and their duration consumed by the plugin.
  // Generally, the plugin will wait for them.
  waitTimers: { name: string; duration: number; status: TimerStatus }[];
}

type TimerStatus = "pending" | "resolved" | "rejected";

interface Meta {
  displayName: string;
  description?: string;
  package: string;
  group?: string;
  additional?: Record<string, any>;
}
```

For every plugin, it'll have a telemetry if it has metadata declared.
With the data, you'll know the sequence of the plugins loaded, the slices and timers they defined and consumed.
For example:

```ts
[
  {
    metadata: {
      displayName: "Config",
      package: "@milkdown/core",
      group: "System",
    },
    injectedSlices: [],
    consumedSlices: [
      /* ... */
    ],
    recordedTimers: [
      {
        name: "ConfigReady",
        duration: 3,
        status: "resolved",
      },
    ],
    waitTimers: [],
  },
  {
    metadata: {
      displayName: "Init",
      package: "@milkdown/core",
      group: "System",
    },
    injectedSlices: [],
    consumedSlices: [
      /* ... */
    ],
    recordedTimers: [
      {
        name: "InitReady",
        duration: 5,
        status: "resolved",
      },
    ],
    waitTimers: [
      {
        name: "ConfigReady",
        duration: 5,
        status: "resolved",
      },
    ],
  },
];
```

From above information, we can know that the `Init` plugin wait for `Config` plugin to be ready.
We can build a sequence diagram from the data.

![Timer Sequence](/blogs/announcing-telemetry-inspector/timer-sequence.gif)

## Add Metadata for Plugin

For plugin maintainers, you can add metadata to your plugin to make it more friendly to the inspector.

```ts
import { MilkdownPlugin } from "@milkdown/ctx";

const yourMilkdownPlugin: MilkdownPlugin = () => {
  /* your implementation */
};

yourMilkdownPlugin.metadata = {
  displayName: "Your Plugin",
  package: "your-plugin-package",
  description: "Your plugin description",
  group: "If you have a lot of plugins in your package, you can group them.",
  addtitional: {
    /* You can add any additional information here. */
    version: "1.0.0",
    authror: "Mike",
  },
};
```

With metadata, your plugin will report telemetry correctly to the inspector.
