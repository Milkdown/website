import { useSetAtom } from "jotai";
import Link from "next/link";
import { FC } from "react";
import { mobileSidebarScope } from "./atom";
import { useRouter } from "next/router";
import clsx from "clsx";

type NavButtonProps = {
  text: string;
};

export const NavButton: FC<NavButtonProps> = ({ text }) => {
  const setScope = useSetAtom(mobileSidebarScope);
  const router = useRouter();
  const { query } = router;
  return (
    <button
      onClick={() => setScope(text.toLowerCase())}
      className={clsx(
        "flex items-center justify-between gap-6",
        query.scope === text.toLowerCase() && "font-bold text-nord-primary"
      )}
    >
      <span className="text-sm">{text}</span>
      <span className="material-symbols-outlined text-xl">chevron_right</span>
    </button>
  );
};

type LinkButtonProps = {
  text: string;
  link: string;
};

export const LinkButton: FC<LinkButtonProps> = ({ text, link }) => {
  const router = useRouter();
  const path = router.asPath;
  return (
    <Link
      href={link}
      className={clsx(
        "flex items-center justify-between gap-6",
        path === link && "font-bold text-nord-primary"
      )}
    >
      <span className="text-sm">{text}</span>
    </Link>
  );
};
