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
    primary ? "button-primary main-button" : "button-default main-button"
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
