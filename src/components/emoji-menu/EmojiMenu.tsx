import { EmojiMenuItem } from "@/components/emoji-menu/EmojiMenuItem";
import { useSlashState } from "@/components/emoji-menu/state";
import { SlashProvider } from "@milkdown/plugin-slash";
import { useInstance } from "@milkdown/react";
import { usePluginViewContext } from "@prosemirror-adapter/react";
import { gemoji } from "gemoji";
import { useEffect, useRef } from "react";

const emojiSearchRegexp = /:(?<search>\S+)/;

export const EmojiMenu = () => {
  const { view, prevState } = usePluginViewContext();
  const slashProvider = useRef<SlashProvider>();
  const ref = useRef<HTMLDivElement>(null);
  const instance = useInstance();
  const [loading] = instance;

  const { root, setOpened, setSelected, selected, setSearch, emojis, onPick } =
    useSlashState(instance);

  useEffect(() => {
    if (!ref.current || loading) return;

    slashProvider.current ??= new SlashProvider({
      content: ref.current,
      debounce: 50,
      shouldShow(this: SlashProvider, view) {
        const currentTextBlockContent = this.getContent(view);

        if (!currentTextBlockContent) {
          setSearch("");
          return false;
        }

        const search = currentTextBlockContent.match(emojiSearchRegexp);
        if (!search) {
          setSearch("");
          return false;
        }

        const text = search.groups!.search;
        const index = gemoji.findIndex((emoji) => {
          return emoji.names.some((name) => name.includes(text));
        });

        if (index < 0) {
          setSearch("");
          return false;
        }

        setSearch(text);
        return true;
      },
    });

    return () => {
      slashProvider.current?.destroy();
      slashProvider.current = undefined;
    };
  }, [loading, root, setOpened, setSearch, setSelected]);

  useEffect(() => {
    slashProvider.current?.update(view, prevState);
  });

  return (
    <div className="hidden">
      <div role="tooltip" ref={ref}>
        {emojis.length > 0 && (
          <ul className="m-0 w-72 list-none rounded bg-gray-50 shadow-lg ring-2 dark:bg-gray-900">
            {emojis.map((item, i) => (
              <EmojiMenuItem
                key={i.toString()}
                index={i}
                instance={instance}
                onSelect={onPick}
                selected={i === selected}
                setSelected={setSelected}
              >
                {item.emoji} :{item.names[0]}:
              </EmojiMenuItem>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
