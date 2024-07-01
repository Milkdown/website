import { linkPlugin } from "@/components/milkdown-shared/linkPlugin";
import {
  defaultValueCtx,
  Editor,
  editorViewOptionsCtx,
  rootCtx,
} from "@milkdown/core";
import { commonmark } from "@milkdown/preset-commonmark";
import { Milkdown, useEditor } from "@milkdown/react";
import { nord } from "@milkdown/theme-nord";
import { useWidgetViewFactory } from "@prosemirror-adapter/react";
import { FC } from "react";

const HomeEditor: FC<{ value: string }> = ({ value }) => {
  const widgetViewFactory = useWidgetViewFactory();

  useEditor((root) => {
    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        root.className =
          "!h-80 md:!h-[480px] overflow-auto bg-nord-foreground rounded-2xl shadow border border-nord-outline dark:bg-nord-foreground-dark dark:border-nord-outline-dark";

        ctx.set(editorViewOptionsCtx, {
          attributes: {
            class: "w-full max-w-full box-border overflow-hidden p-8",
          },
        });
      })
      .config((ctx) => {
        ctx.set(defaultValueCtx, value);
      })
      .config(nord)
      .use(commonmark)
      .use(linkPlugin(widgetViewFactory));
  });

  return <Milkdown />;
};

export default HomeEditor;
