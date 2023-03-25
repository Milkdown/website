import { FC } from "react";

export const InfoCard: FC<{ title: string; desc: string }> = ({
  title,
  desc,
}) => {
  return (
    <div className="flex-1/2 rounded-2xl bg-gray-50 py-3 px-4 dark:bg-nord3">
      <div className="text-xl font-bold">{title}</div>
      <p className="mt-7 font-light">{desc}</p>
    </div>
  );
};
