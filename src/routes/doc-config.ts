export type DocConfigItem = {
  scope: string;
  dir?: string;
  items: string[];
};
export type APIConfigItem = {
  label: string;
  items: string[];
};

export const scopeTitleMap: Record<string, string> = {
  guide: "Guide",
  recipes: "Recipes",
  plugin: "Plugin",
  api: "API",
};
Object.freeze(scopeTitleMap);

export const guideConfig: DocConfigItem = {
  scope: "guide",
  items: [
    "why-milkdown",
    "getting-started",
    "using-crepe",
    "styling",
    "interacting-with-editor",
    "commands",
    "keyboard-shortcuts",
    "macros",
    "using-milkdown-kit",
    "collaborative-editing",
    "prosemirror-api",
    "faq",
  ],
};
export const recipesConfig: DocConfigItem = {
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
};
export const pluginConfig: DocConfigItem = {
  scope: "plugin",
  items: [
    "using-plugins",
    "plugins-101",
    "composable-plugins",
    "example-iframe-plugin",
    "using-components",
  ],
};
export const apiConfigByCategory: APIConfigItem[] = [
  {
    label: "Component",
    items: [
      "component-code-block",
      "component-image-block",
      "component-image-inline",
      "component-link-tooltip",
      "component-list-item-block",
      "component-table-block",
    ],
  },
  {
    label: "Preset",
    items: ["preset-commonmark", "preset-gfm"],
  },
  {
    label: "Plugin",
    items: [
      "plugin-listener",
      "plugin-history",
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
  {
    label: "Theme",
    items: ["theme-nord"],
  },
  {
    label: "Framework",
    items: ["core", "ctx", "utils", "transformer"],
  },
];
export const apiConfig: DocConfigItem = {
  scope: "api",
  dir: "api-src",
  items: apiConfigByCategory.flatMap((x) => x.items),
};

export const docConfig: DocConfigItem[] = [
  guideConfig,
  recipesConfig,
  pluginConfig,
  apiConfig,
];

Object.freeze(apiConfigByCategory);
Object.freeze(guideConfig);
Object.freeze(recipesConfig);
Object.freeze(pluginConfig);
Object.freeze(apiConfig);
Object.freeze(docConfig);
