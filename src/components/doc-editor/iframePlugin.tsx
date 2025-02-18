import { MilkdownPlugin } from "@milkdown/kit/ctx";
import { Node } from "@milkdown/kit/prose/model";
import { $node } from "@milkdown/kit/utils";
import { $remark } from "@milkdown/kit/utils";
import directive from "remark-directive";

const remarkPluginId = "Iframe";

const remarkDirective = $remark(remarkPluginId, () => directive);
const iframeNode = $node("iframe", () => ({
  group: "block",
  atom: true,
  isolating: true,
  marks: "",
  attrs: {
    src: { default: null },
  },
  parseDOM: [
    {
      tag: "iframe.iframe-plugin",
      getAttrs: (dom) => ({
        src: (dom as HTMLElement).getAttribute("src"),
      }),
    },
  ],
  toDOM: (node: Node) => [
    "div",
    { class: "iframe-plugin-container" },
    [
      "a",
      { href: node.attrs.src, contenteditable: false, target: "_blank" },
      [
        "span",
        {
          class: "material-symbols-outlined",
        },
        "open_in_new",
      ],
      "Open in Stackblitz",
    ],
    [
      "iframe",
      {
        contenteditable: false,
        class: "iframe-plugin",
        src: `${node.attrs.src}?embed=1&view=preview&ctl=1`,
      },
      0,
    ],
  ],
  parseMarkdown: {
    match: (node) => node.type === "leafDirective" && node.name === "iframe",
    runner: (state, node, type) => {
      state.addNode(type, { src: (node.attributes as { src: string }).src });
    },
  },
  toMarkdown: {
    match: (node) => node.type.name === "iframe",
    runner: (state, node) => {
      state.addNode("leafDirective", undefined, undefined, {
        name: "iframe",
        attributes: { src: node.attrs.src },
      });
    },
  },
}));

export const iframePlugin: MilkdownPlugin[] = [
  remarkDirective,
  iframeNode,
].flat();
