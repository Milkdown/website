import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import type { FC, ReactNode } from "react";
import { useEffect, useState } from "react";

import { useLinkClass } from "@/hooks";

type OutlineItem = { text: string; level: number; id: string };

const NestedDiv: FC<{ level: number; children: ReactNode }> = ({
  level,
  children,
}) => {
  if (level === 0) return <>{children}</>;

  return (
    <div className={clsx("truncate", level > 1 && "pl-4")}>
      <NestedDiv level={level - 1}>{children}</NestedDiv>
    </div>
  );
};

function Outline(props: { items: OutlineItem[] }) {
  const { items } = props;
  const router = useRouter();
  const [hash, setHash] = useState("");
  const linkClass = useLinkClass();

  useEffect(() => {
    const onHashChange = () => {
      const url = window.location.hash;
      const [_, hash = ""] = url.split("#");
      setHash(hash);
    };

    onHashChange();

    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [router]);

  return (
    <ul className="flex-1 pr-1">
      <div className="text-nord10 mb-2 pl-2">
        <small>On this page</small>
      </div>
      <div className="overflow-x-hidden overflow-y-auto">
        {items
          .filter((item) => item.level <= 2)
          .map((item) => {
            const url = `#${item.id}`;
            return (
              <Link key={item.id} href={url}>
                <div
                  className={clsx(
                    "cursor-pointer rounded-3xl p-2 text-sm font-light",
                    linkClass(hash === item.id),
                  )}
                >
                  <NestedDiv level={item.level}>{item.text}</NestedDiv>
                </div>
              </Link>
            );
          })}
      </div>
    </ul>
  );
}

export default Outline;
