import clsx from "clsx";
import { FC } from "react";

export const Button: FC<{ primary?: boolean; icon?: string; text: string }> = ({
  primary,
  icon,
  text,
}) => {
  const className = clsx(
    "w-full flex font-semibold text-base items-center justify-center rounded-full transition-all",
    "px-10 py-3 sm:px-12 sm:py-4",
    "shadow-md hover:shadow-lg ",
    primary
      ? "text-nord-foreground bg-nord-primary dark:text-nord-foreground hover:bg-nord9"
      : "bg-nord-foreground text-nord-neutral hover:bg-gray-100 dark:bg-nord-foreground-dark dark:text-nord-neutral-dark hover:dark:bg-nord1"
  );

  return (
    <button className={className}>
      {icon && (
        <span className="material-symbols-outlined mr-3 text-base">{icon}</span>
      )}
      <span className="text">{text}</span>
    </button>
  );
};
