import { offset } from "@floating-ui/dom";
import {
  useFloating,
  useHover,
  useInteractions,
  safePolygon,
} from "@floating-ui/react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, ReactNode, useState } from "react";

const Dropdown: FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
    >
      <path d="M10 7.76928C10.1005 7.76928 10.1939 7.78532 10.2805 7.8174C10.367 7.84949 10.4493 7.90449 10.5273 7.9824L14.2725 11.7276C14.3878 11.843 14.4468 11.9881 14.4496 12.1628C14.4523 12.3374 14.3932 12.4851 14.2725 12.6059C14.1517 12.7266 14.0053 12.787 13.8334 12.787C13.6614 12.787 13.515 12.7266 13.3942 12.6059L10 9.21157L6.60587 12.6059C6.49046 12.7212 6.34539 12.7803 6.17066 12.783C5.99608 12.7857 5.84837 12.7266 5.72754 12.6059C5.60684 12.4851 5.5465 12.3387 5.5465 12.1668C5.5465 11.9948 5.60684 11.8484 5.72754 11.7276L9.47275 7.9824C9.5508 7.90449 9.6331 7.84949 9.71962 7.8174C9.80615 7.78532 9.89962 7.76928 10 7.76928Z" />
    </svg>
  );
};

const className = clsx(
  "flex items-center justify-center",
  "rounded-sm px-2 py-1.5",
  "text-nord-neutral dark:text-nord-neutral-dark",
  "fill-nord-neutral dark:fill-nord-neutral-dark",
  "transition hover:bg-nord-outline/80 dark:hover:bg-nord-outline-dark/80",
);

type TextLinkButtonProps = {
  text: string;
  link: string;
};
export const TextLinkButton: FC<TextLinkButtonProps> = ({ link, text }) => {
  return (
    <Link className={className} href={link}>
      <span className="text-sm">{text}</span>
    </Link>
  );
};

type TextButtonProps = {
  text: string;
  children: ReactNode;
};
export const TextButton: FC<TextButtonProps> = ({ text, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10)],
  });
  const router = useRouter();
  const scope = router.query.scope;
  const active = scope === text.toLowerCase();
  const hover = useHover(context, {
    handleClose: safePolygon(),
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);
  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        className={clsx(
          className,
          active && "fill-nord-primary! font-bold text-nord-primary!",
        )}
      >
        <span className="text-sm">{text}</span>
        <div className="rotate-180 transition">
          <Dropdown />
        </div>
      </button>
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="text-center"
          {...getFloatingProps()}
        >
          {children}
        </div>
      )}
    </>
  );
};
