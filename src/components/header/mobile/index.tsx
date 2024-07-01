import { toTitle } from "@/utils/title";
import { FC } from "react";
import { apiConfigByCategory, docConfig, scopeTitleMap } from "@/routes";
import clsx from "clsx";
import { createPortal } from "react-dom";
import { useAtom, useAtomValue } from "jotai";
import { SystemButtonGroup } from "../shared/SystemButtonGroup";
import { useSidebar } from "./useSidebar";
import { mobileSidebarOpen, mobileSidebarScope } from "./atom";
import { NavButton, LinkButton } from "./NavButton";

const ScopeList: FC = () => {
  const scope = useAtomValue(mobileSidebarScope);

  if (!scope) {
    return (
      <>
        <NavButton text="Guide" />
        <NavButton text="Recipes" />
        <NavButton text="Plugin" />
        <NavButton text="API" />
        <LinkButton text="Blog" link="/blog" />
        <LinkButton text="Playground" link="/playground" />
      </>
    );
  }

  if (scope === "api") {
    return (
      <>
        {apiConfigByCategory.map((category) => (
          <div key={category.label} className="flex flex-col gap-4">
            <h2 className="text-left text-xs uppercase text-nord-neutral/60 dark:text-nord-neutral-dark/60">
              {category.label}
            </h2>
            <ul className="m-0 flex flex-col gap-4">
              {category.items.map((item) => {
                const { label } = category;
                const text = item
                  .toLowerCase()
                  .startsWith(`${label.toLowerCase()}-`)
                  ? item.slice(label.length + 1)
                  : item;
                return (
                  <LinkButton
                    key={item}
                    text={text}
                    link={`/docs/api/${item}`}
                  />
                );
              })}
            </ul>
          </div>
        ))}
      </>
    );
  }

  const config = docConfig.find((cfg) => cfg.scope === scope);

  return (
    <>
      {config?.items.map((item) => (
        <LinkButton
          key={item}
          text={toTitle(item)}
          link={`/docs/${scope}/${item}`}
        />
      ))}
    </>
  );
};

export const MobileNav: FC = () => {
  const [scope, setScope] = useAtom(mobileSidebarScope);
  const [open, setOpen] = useAtom(mobileSidebarOpen);

  const { buttonRef, sidebarRef } = useSidebar();

  const title =
    typeof scope === "string" ? scopeTitleMap[scope] || "Menu" : "Menu";

  const renderSidebarElement = () => {
    return (
      <nav
        ref={sidebarRef}
        className={clsx(
          "fixed top-0 bottom-0 z-50 h-screen w-60 pr-4 pl-6",
          open ? "right-0" : "-right-60",
          "border border-nord-neutral/10 shadow dark:border-nord-neutral/10",
          "text-nord-neutral dark:text-nord-neutral-dark",
          "shadow shadow-nord-background dark:shadow-nord-background-dark",
          "bg-gradient-to-b from-nord-foreground/[.64] to-nord-foreground/80 dark:from-nord-foreground-dark/[.64] dark:to-nord-foreground-dark/80",
          "flex flex-col",
          "rounded-l-2xl",
          "backdrop-blur backdrop-filter",
          "transition-right duration-300"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-nord-neutral/10 px-2 dark:border-nord-neutral/10">
          <div className="flex items-center gap-2" onClick={() => setScope("")}>
            {scope && (
              <button className="material-symbols-outlined">
                chevron_left
              </button>
            )}
            <span>{title}</span>
          </div>
          <button
            className="material-symbols-outlined"
            onClick={() => setOpen(false)}
          >
            close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className={clsx("flex flex-col gap-6", "pl-2 pr-4 pt-5 pb-2")}>
            <ScopeList />
          </div>
        </div>
        <div className="flex justify-center pb-8">
          <SystemButtonGroup />
        </div>
      </nav>
    );
  };

  return (
    <div className="flex md:hidden">
      <button
        ref={buttonRef}
        className="flex items-center text-nord-neutral dark:text-nord-neutral-dark"
        onClick={() => setOpen(true)}
      >
        <div className="material-symbols-outlined">Menu</div>
      </button>
      {typeof window !== "undefined"
        ? createPortal(renderSidebarElement(), document.body)
        : renderSidebarElement()}
    </div>
  );
};
