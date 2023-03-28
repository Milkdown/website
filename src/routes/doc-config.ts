export type DocConfigItem = {
  scope: string;
  dir?: string;
  items: string[];
};

export const docConfig: DocConfigItem[] = [
  {
    scope: "guide",
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
    scope: "recipes",
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
    scope: "plugin",
    items: [
      "using-plugins",
      "plugins-101",
      "composable-plugins",
      "example-iframe-plugin",
    ],
  },
  {
    scope: "api",
    dir: "api-src",
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
