import { SlashProvider } from "@milkdown/plugin-slash";
import { useInstance } from "@milkdown/react";
import { usePluginViewContext } from "@prosemirror-adapter/react";
import { useEffect, useRef } from "react";

import { SlashItem } from "@/components/slash-menu/SlashItem";
import { config } from "@/components/slash-menu/config";
import { useSlashState } from "@/components/slash-menu/state";

export const Slash = () => {
  const { view, prevState } = usePluginViewContext();
  const slashProvider = useRef<SlashProvider>();
  const ref = useRef<HTMLDivElement>(null);
  const instance = useInstance();
  const [loading] = instance;
  const { root, setOpened, onKeydown, setSelected, selected } =
    useSlashState(instance);

  useEffect(() => {
    if (!ref.current || loading) return;

    slashProvider.current ??= new SlashProvider({
      content: ref.current,
      debounce: 50,
    });

    return () => {
      slashProvider.current?.destroy();
      slashProvider.current = undefined;
    };
  }, [loading, onKeydown, root, setOpened, setSelected]);

  useEffect(() => {
    slashProvider.current?.update(view, prevState);
  });

  return (
    <div
      role="tooltip"
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseUp={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="absolute cursor-pointer"
      ref={ref}
    >
      <ul className="m-0 w-96 list-none rounded bg-gray-50 shadow-lg ring-2 dark:bg-gray-900">
        {config.map((item, i) => (
          <SlashItem
            key={i.toString()}
            index={i}
            instance={instance}
            onSelect={(ctx) => item.onSelect(ctx)}
            selected={i === selected}
            setSelected={setSelected}
          >
            {item.renderer}
          </SlashItem>
        ))}
      </ul>
    </div>
  );
};
