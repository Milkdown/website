import docsearch from "@docsearch/js";
import clsx from "clsx";
import { FC, ReactNode, useEffect, useRef } from "react";

import { Github } from "@/components/svg-icon";
import { useDocSearch, useSetDarkMode } from "@/providers";

const SystemButtonItem: FC<{ children: ReactNode; onClick?: () => void }> = ({
  children,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "flex h-8 w-8 items-center justify-center",
        "fill-nord-neutral cursor-pointer rounded-sm",
        "text-nord-neutral dark:text-nord-neutral-dark",
        "fill-nord-neutral dark:fill-nord-neutral-dark",
        "hover:bg-nord-outline/80 dark:hover:bg-nord-outline-dark/80",
        "hover:bg-nord-secondary-deep/[0.12] active:bg-nord-secondary-deep/20 dark:hover:bg-nord-secondary-deep/[0.12] dark:active:bg-nord-secondary-deep/20 transition",
      )}
    >
      {children}
    </div>
  );
};

export const SystemButtonGroup = () => {
  const setDarkMode = useSetDarkMode();
  const container = useRef<HTMLDivElement>(null);
  const docSearchConfig = useDocSearch();

  useEffect(() => {
    if (docsearch && typeof docsearch === "function" && container.current) {
      docsearch({
        ...docSearchConfig,

        container: container.current,
      });
    }
  }, [docSearchConfig]);

  return (
    <div className="flex gap-6 pl-2 md:gap-2 lg:gap-4 lg:pl-6">
      <SystemButtonItem>
        <div id="docsearch" ref={container} />
      </SystemButtonItem>
      <a
        href="https://github.com/Milkdown/milkdown"
        target="_blank"
        rel="noreferrer"
      >
        <SystemButtonItem>
          <Github />
        </SystemButtonItem>
      </a>
      <SystemButtonItem onClick={() => setDarkMode((x) => !x)}>
        <div className="material-symbols-outlined">dark_mode</div>
      </SystemButtonItem>
    </div>
  );
};
