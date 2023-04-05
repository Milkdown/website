import { headingAnchorPlugin } from "@/components/milkdown-shared/headingAnchorPlugin";
import { linkPlugin } from "@/components/milkdown-shared/linkPlugin";
import Outline from "@/components/outline";
import {
  defaultValueCtx,
  Editor,
  editorViewCtx,
  editorViewOptionsCtx,
  rootCtx,
} from "@milkdown/core";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { prism, prismConfig } from "@milkdown/plugin-prism";
import {
  blockquoteAttr,
  commonmark,
  inlineCodeAttr,
} from "@milkdown/preset-commonmark";
import { Milkdown, useEditor } from "@milkdown/react";
import { nord } from "@milkdown/theme-nord";
import { outline } from "@milkdown/utils";
import { useWidgetViewFactory } from "@prosemirror-adapter/react";
import { FC, useState } from "react";
import css from "refractor/lang/css";
import javascript from "refractor/lang/javascript";
import jsx from "refractor/lang/jsx";
import markdown from "refractor/lang/markdown";
import tsx from "refractor/lang/tsx";
import typescript from "refractor/lang/typescript";

import { Button } from "./Button";

const Doc: FC<{ content: string; url: string }> = ({ content, url }) => {
  const [outlines, setOutlines] = useState<
    { text: string; level: number; id: string }[]
  >([]);
  const widgetViewFactory = useWidgetViewFactory();

  useEditor(
    (root) => {
      if (!content) return;
      return Editor.make()
        .config((ctx) => {
          ctx.set(rootCtx, root);

          ctx.set(editorViewOptionsCtx, {
            attributes: {
              class: "w-full max-w-full box-border overflow-hidden p-4",
              spellcheck: "false",
            },
          });

          ctx.set(blockquoteAttr.key, () => ({
            class: "border-l-4 border-nord10 pl-4 not-prose dark:border-nord8",
          }));

          ctx.set(inlineCodeAttr.key, () => ({
            class: "font-mono text-nord10 tracking-tight dark:text-nord8",
          }));

          ctx
            .get(listenerCtx)
            .mounted((ctx) => {
              setOutlines(outline()(ctx));
            })
            .markdownUpdated((ctx) => {
              const view = ctx.get(editorViewCtx);
              if (view.state?.doc) setOutlines(outline()(ctx));
            });

          ctx.set(prismConfig.key, {
            configureRefractor: (refractor) => {
              refractor.register(markdown);
              refractor.register(css);
              refractor.register(javascript);
              refractor.register(typescript);
              refractor.register(jsx);
              refractor.register(tsx);
            },
          });
        })
        .config((ctx) => {
          ctx.set(defaultValueCtx, content);
        })
        .config(nord)
        .use(commonmark)
        .use(prism)
        .use(linkPlugin(widgetViewFactory))
        .use(headingAnchorPlugin(widgetViewFactory))
        .use(listener);
    },
    [content]
  );

  return (
    <>
      <Milkdown />
      <div className="fixed inset-y-16 right-20 hidden flex-col gap-4 overflow-y-auto xl:flex xl:w-60 2xl:right-[calc(50vw-28rem-15rem)]">
        <a className="float-right" href={url} target="_blank">
          <Button primary text="Edit on github" icon="edit" />
        </a>
        <Outline items={outlines} />
      </div>
    </>
  );
};

export default Doc;
