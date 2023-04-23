import { Ctx } from "@milkdown/ctx";
import { Instance } from "@milkdown/react";
import { clsx } from "clsx";
import { FC, ReactNode } from "react";

type EmojiItemProps = {
  index: number;
  instance: Instance;
  onSelect: (ctx: Ctx) => void;
  children: ReactNode;
  selected: boolean;
  setSelected: (selected: number) => void;
};

export const EmojiMenuItem: FC<EmojiItemProps> = ({
  index,
  instance,
  onSelect,
  children,
  selected,
  setSelected,
}) => {
  const [loading, getEditor] = instance;

  return (
    <li
      className={clsx(
        "cursor-pointer truncate whitespace-nowrap px-6 py-3 text-sm",
        selected && "bg-gray-200 dark:bg-gray-700"
      )}
      onMouseMove={() => setSelected(index)}
      onMouseDown={(e) => {
        if (loading) return;
        e.preventDefault();
        getEditor().action(onSelect);
      }}
    >
      {children}
    </li>
  );
};
