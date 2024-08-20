import { useLinkClass } from "@/hooks";
import clsx from "clsx";
import type { FC, RefObject } from "react";
import pkgJson from "../../../../package.json";
import type { CodemirrorProps, CodemirrorRef } from "../../codemirror";
import { Codemirror } from "../../codemirror";
import { useShare } from "../../playground-editor/ShareProvider";

interface ControlPanelProps extends CodemirrorProps {
  codemirrorRef: RefObject<CodemirrorRef>;
  hide: boolean;
  setHide: (hide: boolean) => void;
}

export const ControlPanel: FC<ControlPanelProps> = ({
  hide,
  content,
  onChange,
  lock,
  codemirrorRef,
  setHide,
}) => {
  const linkClass = useLinkClass();
  const share = useShare();

  if (hide) {
    return (
      <div className="fixed top-36 right-6 flex flex-col gap-2">
        <button
          onClick={() => {
            setHide(false);
            document.documentElement.scrollTop = 0;
          }}
          className={clsx(
            linkClass(false),
            "flex h-12 w-12 items-center justify-center rounded",
            "bg-nord6/70 dark:bg-nord3/70"
          )}
        >
          <span className="material-symbols-outlined text-2xl">
            chevron_left
          </span>
        </button>

        <button
          onClick={() => share()}
          className={clsx(
            linkClass(false),
            "flex h-12 w-12 items-center justify-center rounded",
            "bg-nord6/70 dark:bg-nord3/70"
          )}
        >
          <span className="material-symbols-outlined !text-base">share</span>
        </button>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="flex h-10 items-center justify-between border-b border-nord4 bg-gray-200 px-4 py-2 font-light dark:border-gray-600 dark:bg-gray-700">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHide(true)}
            className={clsx(
              linkClass(false),
              "flex h-8 w-8 items-center justify-center rounded-full",
              "hover:bg-nord6/70 hover:dark:bg-nord3/70"
            )}
          >
            <span className="material-symbols-outlined !text-base">
              chevron_right
            </span>
          </button>
          <div>
            <span>Milkdown Playground</span>
            <span className="ml-2 font-mono text-xs text-gray-600 dark:text-gray-300">
              v{pkgJson.dependencies["@milkdown/core"]}
            </span>
          </div>
        </div>
        <div className="flex">
          <button
            onClick={() => share()}
            className={clsx(
              linkClass(false),
              "flex h-8 w-8 items-center justify-center rounded-full",
              "hover:bg-nord6/70 hover:dark:bg-nord3/70"
            )}
          >
            <span className="material-symbols-outlined !text-base">share</span>
          </button>
        </div>
      </div>
      <Codemirror
        ref={codemirrorRef}
        content={content}
        onChange={onChange}
        lock={lock}
      />
    </div>
  );
};
