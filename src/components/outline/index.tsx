import { useLinkClass } from "@/hooks";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import type { FC, ReactNode } from "react";
import { useEffect, useState } from "react";

type OutlineItem = { text: string; level: number; id: string };

const NestedDiv: FC<{ level: number; children: ReactNode }> = ({
  level,
  children,
}) => {
  if (level === 0) return <>{children}</>;

  return (
    <div className="pl-1">
      <NestedDiv level={level - 1}>{children}</NestedDiv>
    </div>
  );
};

function Outline(props: { items: OutlineItem[] }) {
  const { items } = props;
  const router = useRouter();
  const location = router.asPath;
  const [hash, setHash] = useState("");
  const linkClass = useLinkClass();

  useEffect(() => {
    const [_, hash = ""] = location.split("#");
    setHash(hash);
  }, [location]);

  return (
    <ul className="flex-1 pr-1">
      <div className="mb-2 pl-3 text-nord10">
        <small>On this page</small>
      </div>
      <div className="overflow-y-auto overflow-x-hidden">
        {items
          .filter((item) => item.level <= 2)
          .map((item) => {
            const url = `#${item.id}`;
            return (
              <Link key={item.id} href={url}>
                <div
                  className={clsx(
                    "cursor-pointer truncate rounded-3xl p-2 text-sm font-light",
                    linkClass(hash === item.id)
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
