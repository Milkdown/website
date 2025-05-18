import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";

import { APIConfigItem } from "@/routes";
import { toTitle } from "@/utils/title";

type DropdownWithLabelProps = {
  scope: string;
  items: APIConfigItem[];
};

const LabeledItem: FC<{ scope: string; item: string; label: string }> = ({
  scope,
  item,
  label,
}) => {
  const router = useRouter();
  const location = router.asPath;
  const url = `/docs/${scope}/${item}`;
  const active = location === url;
  const text = item.toLowerCase().startsWith(`${label.toLowerCase()}-`)
    ? item.slice(label.length + 1)
    : item;
  return (
    <Link
      className={clsx(
        "rounded-[20px] px-6 py-2 text-sm capitalize",
        "bg-nord-secondary-deep/[.06] transition",
        "hover:bg-nord-secondary-deep/[0.12] active:bg-nord-secondary-deep/20 dark:hover:bg-nord-secondary-deep/[0.12] dark:active:bg-nord-secondary-deep/20",
        active && "bg-nord-secondary-deep/20 text-nord-primary font-bold",
      )}
      href={url}
    >
      <li>{toTitle(text)}</li>
    </Link>
  );
};

const LabeledItemList: FC<APIConfigItem & { scope: string }> = ({
  label,
  items,
  scope,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-nord-neutral/60 dark:text-nord-neutral-dark/60 text-left text-xs uppercase">
        {label}
      </h2>
      <ul className="m-0 flex flex-wrap items-start justify-start gap-4">
        {items.map((item) => (
          <LabeledItem key={item} scope={scope} item={item} label={label} />
        ))}
      </ul>
    </div>
  );
};

export const DropdownWithLabel: FC<DropdownWithLabelProps> = ({
  items,
  scope,
}) => {
  return (
    <div
      className={clsx(
        "flex w-96 flex-col gap-6 p-10",
        "bg-nord-foreground dark:bg-nord-foreground-dark",
        "rounded-2xl px-6 py-8",
        "border-nord-neutral/10 dark:border-nord-neutral/10 border shadow-sm",
      )}
    >
      {items.map((item) => (
        <LabeledItemList key={item.label} {...item} scope={scope} />
      ))}
    </div>
  );
};
