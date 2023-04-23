import { commandsCtx, editorViewCtx, rootDOMCtx } from "@milkdown/core";
import { Ctx, MilkdownPlugin } from "@milkdown/ctx";
import { slashFactory, SlashProvider } from "@milkdown/plugin-slash";
import {
  createCodeBlockCommand,
  insertHrCommand,
  wrapInHeadingCommand,
} from "@milkdown/preset-commonmark";
import { type Instance, useInstance } from "@milkdown/react";
import {
  usePluginViewContext,
  usePluginViewFactory,
} from "@prosemirror-adapter/react";
import { clsx } from "clsx";
import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type SlashItemProps = {
  index: number;
  instance: Instance;
  onSelect: (ctx: Ctx) => void;
  children: ReactNode;
  selected: boolean;
  setSelected: (selected: number) => void;
};

const SlashItem: FC<SlashItemProps> = ({
  index,
  instance,
  onSelect,
  children,
  selected,
  setSelected,
}) => {
  const [loading, getEditor] = instance;

  const onPick = () => {
    if (loading) return;

    getEditor().action((ctx) => {
      onSelect(ctx);
    });
  };

  return (
    <li
      className={clsx(
        "cursor-pointer px-6 py-3",
        selected && "bg-gray-200 dark:bg-gray-700"
      )}
      onMouseMove={() => setSelected(index)}
      onMouseDown={(e) => {
        e.preventDefault();
        onPick();
      }}
    >
      {children}
    </li>
  );
};

type ConfigItem = {
  renderer: ReactNode;
  onSelect: (ctx: Ctx) => void;
};

const removeSlash = (ctx: Ctx) => {
  // remove slash
  const view = ctx.get(editorViewCtx);
  view.dispatch(
    view.state.tr.delete(
      view.state.selection.from - 1,
      view.state.selection.from
    )
  );
};

const config: Array<ConfigItem> = [
  {
    onSelect: (ctx: Ctx) =>
      ctx.get(commandsCtx).call(wrapInHeadingCommand.key, 1),
    renderer: (
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-nord-10 dark:text-nord-9">
          format_h1
        </span>
        Large Heading
      </div>
    ),
  },
  {
    onSelect: (ctx: Ctx) =>
      ctx.get(commandsCtx).call(wrapInHeadingCommand.key, 2),
    renderer: (
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-nord-10 dark:text-nord-9">
          format_h2
        </span>
        Medium Heading
      </div>
    ),
  },
  {
    onSelect: (ctx: Ctx) =>
      ctx.get(commandsCtx).call(wrapInHeadingCommand.key, 3),
    renderer: (
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-nord-10 dark:text-nord-9">
          format_h3
        </span>
        Small Heading
      </div>
    ),
  },
  {
    onSelect: (ctx: Ctx) =>
      ctx.get(commandsCtx).call(createCodeBlockCommand.key),
    renderer: (
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-nord-10 dark:text-nord-9">
          data_object
        </span>
        Code Block
      </div>
    ),
  },
  {
    onSelect: (ctx: Ctx) => ctx.get(commandsCtx).call(insertHrCommand.key),
    renderer: (
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-nord-10 dark:text-nord-9">
          horizontal_rule
        </span>
        Divider
      </div>
    ),
  },
].map((item) => ({
  ...item,
  onSelect: (ctx: Ctx) => {
    removeSlash(ctx);
    item.onSelect(ctx);
  },
}));

const inspectKeys = ["ArrowDown", "ArrowUp", "Enter"];

const slash = slashFactory("slashDropDown") satisfies MilkdownPlugin[];

const Slash = () => {
  const { view, prevState } = usePluginViewContext();
  const slashProvider = useRef<SlashProvider>();
  const ref = useRef<HTMLDivElement>(null);
  const instance = useInstance();
  const [loading, getEditor] = instance;
  const [selected, setSelected] = useState(0);
  const selectedRef = useRef(0);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  const root = useMemo(() => {
    if (loading) return undefined;
    try {
      return getEditor().ctx.get(rootDOMCtx);
    } catch {
      return undefined;
    }
  }, [getEditor, loading]);

  const setOpened = useCallback(
    (opened: boolean) => {
      getEditor()?.action((ctx) => {
        ctx.update(slash.key, (spec) => ({
          ...spec,
          opened,
        }));
      });
    },
    [getEditor]
  );

  const onKeydown = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key;
      if (key === "ArrowDown") {
        setSelected((s) => (s + 1) % config.length);
        return;
      }
      if (key === "ArrowUp") {
        setSelected((s) => (s - 1 + config.length) % config.length);
        return;
      }
      slashProvider.current?.hide();
      getEditor()?.action(config[selectedRef.current].onSelect);
    },
    [getEditor]
  );

  useEffect(() => {
    if (!ref.current || loading) return;

    slashProvider.current ??= new SlashProvider({
      content: ref.current,
      debounce: 50,
      tippyOptions: {
        onShow: () => {
          setOpened(true);
          root?.addEventListener("keydown", onKeydown);
        },
        onHide: () => {
          setSelected(0);
          setOpened(false);
          root?.removeEventListener("keydown", onKeydown);
        },
      },
    });

    return () => {
      slashProvider.current?.destroy();
      slashProvider.current = undefined;
    };
  }, [loading, onKeydown, root, setOpened]);

  useEffect(() => {
    slashProvider.current?.update(view, prevState);
  });

  return (
    <div className="hidden">
      <div
        role="tooltip"
        className="w-96 rounded bg-gray-50 shadow-lg ring-2 dark:bg-gray-900"
        ref={ref}
      >
        <ul className="m-0 list-none">
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
    </div>
  );
};

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
