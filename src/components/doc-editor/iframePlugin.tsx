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
    "iframe",
    { ...node.attrs, contenteditable: false, class: "iframe-plugin" },
    0,
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
