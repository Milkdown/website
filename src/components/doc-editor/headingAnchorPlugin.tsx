import { headingSchema } from "@milkdown/preset-commonmark";
import { Plugin } from "@milkdown/prose/state";
import type { Decoration } from "@milkdown/prose/view";
import { DecorationSet } from "@milkdown/prose/view";
import { $prose } from "@milkdown/utils";
import type { useWidgetViewFactory } from "@prosemirror-adapter/react";
import { useWidgetViewContext } from "@prosemirror-adapter/react";
import type { FC } from "react";

const HeadingWidget: FC = () => {
  const { spec } = useWidgetViewContext();
  const id: string = spec?.id ?? "";

  return (
    <a
      className="!mr-2 inline-flex items-center align-middle text-[1em] text-nord10 !no-underline hover:text-nord7"
      href={`#${id}`}
    >
      <span className="material-symbols-outlined text-[1em]">grocery</span>
    </a>
  );
};

export const headingAnchorPlugin = (
  widgetViewFactory: ReturnType<typeof useWidgetViewFactory>
) => {
  const widget = widgetViewFactory({
    as: "span",
    component: HeadingWidget,
  });

  return $prose(
    (ctx) =>
      new Plugin({
        state: {
          init() {
            return DecorationSet.empty;
          },
          apply(tr) {
            const widgets: Decoration[] = [];

            tr.doc.descendants((node, pos) => {
              if (node.type === headingSchema.type(ctx)) {
                widgets.push(
                  widget(pos + 1, {
                    id: node.attrs.id,
                    level: node.attrs.level,
                    side: -1,
                  })
                );
              }
            });

            return DecorationSet.create(tr.doc, widgets);
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      })
  );
};
