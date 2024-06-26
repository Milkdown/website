import { commandsCtx } from "@milkdown/core";
import { BlockProvider } from "@milkdown/plugin-block";
import {
  turnIntoTextCommand,
  wrapInHeadingCommand,
} from "@milkdown/preset-commonmark";
import { useInstance } from "@milkdown/react";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

export const Block = () => {
  const blockProvider = useRef<BlockProvider>();
  const element = useRef<HTMLDivElement | null>(null);
  const [loading, get] = useInstance();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (element.current && !loading) {
      const { ctx } = get();
      blockProvider.current ??= new BlockProvider({
        getOffset: () => 16,
        getPlacement: () => "left-start",
        ctx,
        content: element.current,
      });
      blockProvider.current.update();
    }

    return () => {
      blockProvider?.current?.destroy();
    };
  }, [loading, get, element]);

  return (
    <div
      className={clsx(
        "absolute cursor-grab rounded-full border-2 bg-gray-50 dark:border-gray-900 dark:bg-gray-900",
        showMenu && "ring-2 ring-offset-2"
      )}
      ref={element}
    >
      <div onClick={() => setShowMenu((x) => !x)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
          />
        </svg>
      </div>
      {showMenu && (
        <div className="absolute top-full mt-2 w-60 cursor-pointer rounded border-2 bg-gray-50 shadow dark:border-gray-900 dark:bg-gray-900">
          <div
            onClick={() => {
              if (loading) return;

              const commands = get().ctx.get(commandsCtx);
              commands.call(wrapInHeadingCommand.key, 1);
            }}
            className="px-6 py-3 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Heading 1
          </div>
          <div
            onClick={() => {
              if (loading) return;

              const commands = get().ctx.get(commandsCtx);
              commands.call(wrapInHeadingCommand.key, 2);
            }}
            className="px-6 py-3 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Heading 2
          </div>
          <div
            onClick={() => {
              if (loading) return;

              const commands = get().ctx.get(commandsCtx);
              commands.call(wrapInHeadingCommand.key, 3);
            }}
            className="px-6 py-3 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Heading 3
          </div>
          <div
            onClick={() => {
              if (loading) return;

              const commands = get().ctx.get(commandsCtx);
              commands.call(turnIntoTextCommand.key);
            }}
            className="px-6 py-3 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Text
          </div>
        </div>
      )}
    </div>
  );
};
