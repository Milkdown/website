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
          "h-96 overflow-auto bg-gray-100 rounded-2xl shadow-inner border-gray-200 dark:bg-gray-800 dark:border-gray-700";

        ctx.set(editorViewOptionsCtx, {
          attributes: {
            class: "w-full max-w-full box-border overflow-hidden p-4",
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
