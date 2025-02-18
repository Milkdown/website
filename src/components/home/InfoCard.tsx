import clsx from "clsx";
import { FC } from "react";

export const InfoCard: FC<{
  title: string;
  desc: string;
  emoji: string;
}> = ({ emoji, title, desc }) => {
  return (
    <div
      className={clsx(
        "flex-1/2 rounded-2xl bg-gray-50 px-6 py-4 text-center dark:bg-nord3 md:py-6 md:px-10 md:text-left",
        "text-nord-neutral/[.87] dark:text-nord-neutral-dark/[.87]",
      )}
    >
      <div className="text-xl md:text-4xl">{emoji}</div>
      <div className="mt-3 font-bold md:mt-5 md:text-xl">{title}</div>
      <p className="mt-2 text-sm font-light md:mt-4 md:text-base">{desc}</p>
    </div>
  );
};
