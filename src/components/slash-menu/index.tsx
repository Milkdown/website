import { Ctx } from "@milkdown/ctx";
import { usePluginViewFactory } from "@prosemirror-adapter/react";

import { Slash } from "@/components/slash-menu/Slash";
import { slash } from "@/components/slash-menu/config";

const inspectKeys = ["ArrowDown", "ArrowUp", "Enter"];

export const useSlash = () => {
  const pluginViewFactory = usePluginViewFactory();
  return {
    plugins: slash,
    config: (ctx: Ctx) => {
      ctx.set(slash.key, {
        props: {
          handleKeyDown: (view, event) => {
            if (!ctx.get(slash.key).opened) {
              return false;
            }
            return inspectKeys.includes(event.key);
          },
        },
        view: pluginViewFactory({
          component: Slash,
        }),
        opened: false,
      });
    },
  };
};
