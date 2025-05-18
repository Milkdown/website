import clsx from "clsx";
import { atom, useAtom } from "jotai";
import { useAtomCallback } from "jotai/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect } from "react";

import { DesktopNav } from "./desktop";
import { MobileNav } from "./mobile";

const displayAtom = atom(false);

export const Header: FC = () => {
  const router = useRouter();
  const path = router.asPath;
  const [display, setDisplay] = useAtom(displayAtom);

  useEffect(() => {
    setDisplay(path !== "/");
  }, [path, setDisplay]);

  useScroll(path);

  return (
    <header
      className={clsx(
        "flex items-center justify-between",
        "fixed z-50 w-full",
        "px-4 py-4 lg:px-10 xl:px-20",
        "shadow-nord-background dark:shadow-nord-background-dark shadow-sm",
        "bg-nord-background/80 dark:bg-nord-background-dark/80",
        "backdrop-blur-sm",
        "transition-transform duration-300",
        !display && "-translate-y-full",
      )}
    >
      <Link href="/" className="flex items-center gap-2 lg:gap-4">
        <Image
          alt={"milkdown logo"}
          width={40}
          height={40}
          className="inline-block h-10 w-10"
          src="/milkdown-logo.svg"
        />
        <span className="text-base xl:text-xl">Milkdown</span>
      </Link>
      <DesktopNav />
      <MobileNav />
    </header>
  );
};

function useScroll(path: string) {
  const onScroll = useAtomCallback(
    useCallback(
      (get, set) => {
        if (path !== "/") {
          return;
        }
        const currentDisplay = get(displayAtom);
        if (currentDisplay) {
          if (document.documentElement.scrollTop === 0) {
            set(displayAtom, false);
          }
          return;
        }
        set(displayAtom, true);
      },
      [path],
    ),
  );

  useEffect(() => {
    document.addEventListener("scroll", onScroll);
    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);
}
