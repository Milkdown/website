import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";

import { DocConfigItem } from "@/routes";
import { toTitle } from "@/utils/title";

type DropdownProps = DocConfigItem & {};

const DropdownItem: FC<{ scope: string; item: string }> = ({ scope, item }) => {
  const router = useRouter();
  const location = router.asPath;
  const url = `/docs/${scope}/${item}`;
  const active = location === url;

  return (
    <Link href={url}>
      <li
        className={clsx(
          "w-44 rounded-sm px-4 py-2",
          "truncate text-left text-sm",
          "text-nord-neutral dark:text-nord-neutral-dark",
          "hover:bg-nord-secondary-deep/[0.12] active:bg-nord-secondary-deep/20 dark:hover:bg-nord-secondary-deep/[0.12] dark:active:bg-nord-secondary-deep/20 transition",
          active && "bg-nord-secondary-deep/20 text-nord-primary font-bold",
        )}
      >
        {toTitle(item)}
      </li>
    </Link>
  );
};

export const Dropdown: FC<DropdownProps> = ({ scope, items }) => {
  return (
    <div
      className={clsx(
        "bg-nord-foreground dark:bg-nord-foreground-dark",
        "rounded-2xl p-6",
        "border-nord-neutral/10 dark:border-nord-neutral/10 border shadow-sm",
      )}
    >
      <ul className="m-0 flex flex-col gap-2">
        {items.map((item) => (
          <DropdownItem key={item} scope={scope} item={item} />
        ))}
      </ul>
    </div>
  );
};
