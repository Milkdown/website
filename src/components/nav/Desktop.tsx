import { useLinkClass } from "@/hooks";
import { useHideSidePanel, useShowSectionSidePanel } from "@/providers";
import { docConfig } from "@/routes";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import type { FC, ReactNode } from "react";
import { useMemo } from "react";

import { System } from "./System";

const NavItem: FC<{
  icon: string;
  text: string;
  id?: string;
  link?: string;
}> = ({ icon, text, id, link }) => {
  const showSectionSidePanel = useShowSectionSidePanel();
  const hideSidePanel = useHideSidePanel();
  const router = useRouter();
  const pageId = router.query.id;
  const page = docConfig.find((section) =>
    section.items.find((item) => item === pageId)
  );
  const isActive = Boolean(
    router.pathname === link || (id && page?.scope === id)
  );
  const linkClass = useLinkClass();

  const wrapperClassName = useMemo(
    () => clsx("text-center cursor-pointer", linkClass(isActive, false)),
    [isActive, linkClass]
  );

  const ContainerComponent: FC<{ children: ReactNode }> = useMemo(() => {
    if (link) {
      const Container: FC<{ children: ReactNode }> = ({ children }) => (
        <Link className={wrapperClassName} href={link}>
          {children}
        </Link>
      );
      return Container;
    }

    const onMouseEnter = () => {
      if (!id) {
        return;
      }
      showSectionSidePanel(id, "desktop");
    };

    const onMouseLeave = () => {
      if (!id) {
        return;
      }
      hideSidePanel(500);
    };

    const Container: FC<{ children: ReactNode }> = ({ children }) => {
      return (
        <div
          className={wrapperClassName}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {children}
        </div>
      );
    };
    return Container;
  }, [hideSidePanel, id, link, showSectionSidePanel, wrapperClassName]);

  return (
    <ContainerComponent>
      <div
        className={`flex justify-center rounded-3xl py-0.5 px-4
        ${
          isActive
            ? "bg-nord8 dark:bg-nord9"
            : "hover:bg-gray-300 dark:hover:bg-gray-700"
        }`}
      >
        <div className="material-symbols-outlined">{icon}</div>
      </div>
      <div className="text-xs font-light">{text}</div>
    </ContainerComponent>
  );
};

export const DesktopNav: FC = () => {
  return (
    <nav className="flex h-full w-full flex-col items-center justify-between pt-11 pb-14">
      <div>
        <div
          className="mx-auto flex h-14 w-14 cursor-pointer items-center justify-center
          rounded-full border-2
          border-gray-300 bg-white shadow-inner hover:bg-gray-200 dark:border-gray-600
          dark:bg-gray-800 hover:dark:bg-gray-700"
        >
          <Link href="/">
            <Image
              alt={"milkdown logo"}
              width={36}
              height={36}
              className="h-9 w-9"
              src="/milkdown-logo.svg"
            />
          </Link>
        </div>
        <div className="mt-8 flex flex-col gap-4">
          <NavItem icon="design_services" text="Guide" id="guide" />
          <NavItem icon="apps" text="Recipes" id="recipes" />
          <NavItem icon="extension" text="Plugin" id="plugin" />
          <NavItem icon="api" text="API" id="api" />
          <NavItem icon="pages" text="Blog" link="/blog" />
          <NavItem icon="view_carousel" text="Playground" link="/playground" />
        </div>
      </div>

      <System />
    </nav>
  );
};
