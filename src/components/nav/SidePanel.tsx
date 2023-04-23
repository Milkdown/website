import { useLinkClass } from "@/hooks";
import {
  ROOT,
  useHideSidePanel,
  useHoldSidePanel,
  useShowRootSidePanel,
  useShowSectionSidePanel,
  useSidePanelState,
} from "@/providers";
import { docConfig, DocConfigItem } from "@/routes";
import { toTitle } from "@/utils/title";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useCallback, useEffect, useMemo } from "react";

type SidePanelItem = {
  id: string;
  text: string;
  link?: string;
  onClick?: () => void;
  prefixIcon?: string;
  suffixIcon?: string;
};

type SidePanelGroupProps = {
  title?: string;
  items: Array<SidePanelItem>;
};

const SidePanelGroup: FC<SidePanelGroupProps> = ({ title, items }) => {
  const router = useRouter();
  const pageId = router.query.id;
  const linkClass = useLinkClass();

  const getItemClassName = useCallback(
    (isActive: boolean) => {
      return clsx(
        "cursor-pointer rounded-full p-4 font-light",
        "flex items-center justify-between gap-3",
        linkClass(isActive)
      );
    },
    [linkClass]
  );

  return (
    <div className="my-2 text-nord0">
      {title && <div className="p-4 text-lg font-medium">{title}</div>}
      <ul>
        {items.map((item, index) => {
          if (item.link) {
            return (
              <Link
                key={index.toString()}
                className={getItemClassName(item.id === pageId)}
                href={item.link}
              >
                {item.prefixIcon && item.prefixIcon === "$" ? (
                  <span className="w-6" />
                ) : (
                  <span className="material-symbols-outlined">
                    {item.prefixIcon}
                  </span>
                )}
                <span className="flex-1">{item.text}</span>
                {item.suffixIcon && (
                  <span className="material-symbols-outlined">
                    {item.suffixIcon}
                  </span>
                )}
              </Link>
            );
          }
          return (
            <div
              key={index.toString()}
              className={getItemClassName(item.id === pageId)}
              onClick={item.onClick}
            >
              {item.prefixIcon && item.prefixIcon === "$" ? (
                <span className="w-6" />
              ) : (
                <span className="material-symbols-outlined">
                  {item.prefixIcon}
                </span>
              )}
              <span className="flex-1">{item.text}</span>
              {item.suffixIcon && (
                <span className="material-symbols-outlined">
                  {item.suffixIcon}
                </span>
              )}
            </div>
          );
        })}
      </ul>
    </div>
  );
};

const getRoot = (
  showSectionSidePanel: (id: string) => void
): SidePanelGroupProps => {
  return {
    items: [
      {
        id: "guide",
        text: "Guide",
        prefixIcon: "design_services",
        suffixIcon: "arrow_forward",
        onClick: () => showSectionSidePanel("guide"),
      },
      {
        id: "recipes",
        text: "Recipes",
        prefixIcon: "apps",
        suffixIcon: "arrow_forward",
        onClick: () => showSectionSidePanel("recipes"),
      },
      {
        id: "plugin",
        text: "Plugin",
        prefixIcon: "extension",
        suffixIcon: "arrow_forward",
        onClick: () => showSectionSidePanel("plugin"),
      },
      {
        id: "api",
        text: "Api",
        prefixIcon: "api",
        suffixIcon: "arrow_forward",
        onClick: () => showSectionSidePanel("api"),
      },
      {
        id: "blog",
        text: "Blog",
        prefixIcon: "pages",
        link: "/blog",
      },
      {
        id: "playground",
        text: "Playground",
        prefixIcon: "view_carousel",
        link: "/playground",
      },
    ],
  };
};

const sectionToGroup = (section?: DocConfigItem): SidePanelGroupProps => {
  if (!section) {
    return {
      items: [],
    };
  }

  return {
    items: section.items.map((item): SidePanelItem => {
      return {
        id: item,
        text: toTitle(item),
        link: `/docs/${section.scope}/${item}`,
      };
    }),
  };
};

export const SidePanel: FC = () => {
  const holdSidePanel = useHoldSidePanel();
  const hideSidePanel = useHideSidePanel();
  const showSectionSidePanel = useShowSectionSidePanel();
  const showRootSidePanel = useShowRootSidePanel();
  const { mode, activeId } = useSidePanelState();
  const isRoot = activeId === ROOT;
  const router = useRouter();
  const location = router.asPath;

  useEffect(() => {
    hideSidePanel(0);
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [hideSidePanel, location]);

  const itemsGroup = useMemo(
    () =>
      isRoot
        ? getRoot((key: string) => showSectionSidePanel(key, "mobile"))
        : sectionToGroup(docConfig.find((item) => item.scope === activeId)),
    [activeId, isRoot, showSectionSidePanel]
  );

  return (
    <div
      className="flex h-full w-full flex-col divide-y overflow-auto overscroll-none p-3"
      onMouseEnter={holdSidePanel}
      onMouseLeave={() => hideSidePanel(500)}
    >
      {mode === "mobile" && !isRoot && (
        <SidePanelGroup
          items={[
            {
              id: ROOT,
              onClick: showRootSidePanel,
              text: "Back",
              prefixIcon: "arrow_back",
            },
          ]}
        />
      )}
      <SidePanelGroup {...itemsGroup} />
    </div>
  );
};
