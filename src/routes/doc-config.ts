export type DocConfigItem = {
  dir: string;
  items: string[];
};

export const docConfig: DocConfigItem[] = [
  {
    dir: "guide",
    items: [
      "why-milkdown",
      "getting-started",
      "styling",
      "interacting-with-editor",
      "commands",
      "keyboard-shortcuts",
      "macros",
      "collaborative-editing",
      "faq",
    ],
  },
  {
    dir: "recipes",
    items: [
      "react",
      "vue",
      "svelte",
      "solidjs",
      "nextjs",
      "nuxtjs",
      "angular",
      "vue2",
    ],
  },
  {
    dir: "plugin",
    items: [
      "using-plugins",
      "plugins-101",
      "composable-plugins",
      "example-iframe-plugin",
    ],
  },
  {
    dir: "api",
    items: [
      "core",
      "ctx",
      "transformer",
      "utils",
      "preset-commonmark",
      "preset-gfm",
      "theme-nord",
      "plugin-listener",
      "plugin-history",
      "plugin-math",
      "plugin-diagram",
      "plugin-emoji",
      "plugin-prism",
      "plugin-cursor",
      "plugin-tooltip",
      "plugin-slash",
      "plugin-block",
      "plugin-indent",
      "plugin-trailing",
      "plugin-upload",
      "plugin-clipboard",
      "plugin-collab",
    ],
  },
];

export const docList = docConfig.flatMap(({ items }) => items);
