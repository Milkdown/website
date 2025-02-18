import clsx from "clsx";
import { FC } from "react";

export const Button: FC<{ primary?: boolean; icon?: string; text: string }> = ({
  primary,
  icon,
  text,
}) => {
  const className = clsx(
    "flex h-12 items-center justify-center rounded-3xl shadow-md hover:shadow-lg pl-4 pr-6",
    primary
      ? "text-gray-50 bg-nord10 hover:bg-nord9"
      : "bg-gray-200 hover:bg-gray-100 dark:bg-nord3 hover:dark:bg-nord1",
  );

  return (
    <button className={className}>
      {icon && (
        <span className="material-symbols-outlined mr-3 text-base">{icon}</span>
      )}
      <span className="text-sm">{text}</span>
    </button>
  );
};
