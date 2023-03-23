import { useLinkClass } from "@/hooks";
import * as Toast from "@radix-ui/react-toast";
import clsx from "clsx";
import type { FC, ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import styles from "./style.module.css";

type ToastType = "success" | "fail" | "warning" | "info";

type Show = (desc: string, type: ToastType, onConfirm?: () => void) => void;
export const setShowCtx = createContext<Show>(() => {});

export const useToast = () => {
  return useContext(setShowCtx);
};

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [desc, setDesc] = useState("");
  const [onConfirm, setOnConfirm] = useState<undefined | (() => void)>(
    undefined
  );
  const [type, setType] = useState<ToastType>("success");
  const linkClassName = useLinkClass();

  const show: Show = useCallback((desc, type, onConfirm) => {
    setDesc(desc);
    setType(type);
    setOpen(true);
    setOnConfirm(() => onConfirm);
  }, []);

  const icon = useMemo(() => {
    switch (type) {
      case "warning":
        return "report_problem";
      case "fail":
        return "error_outline";
      case "info":
        return "new_releases";
      case "success":
      default:
        return "check_circle_outline";
    }
  }, [type]);

  const iconColor = useMemo(() => {
    switch (type) {
      case "warning":
        return "text-nord13";
      case "fail":
        return "text-nord11";
      case "info":
        return "text-nord15";
      case "success":
      default:
        return "text-nord14";
    }
  }, [type]);

  return (
    <setShowCtx.Provider value={show}>
      <Toast.Provider swipeDirection="right">
        {children}
        <Toast.Root
          className={styles["toast-root"]}
          open={open}
          onOpenChange={setOpen}
        >
          <Toast.Title className={styles["toast-title"]}>
            <span className={clsx("material-symbols-outlined", iconColor)}>
              {icon}
            </span>
            <span className="text-sm font-light">{desc}</span>
          </Toast.Title>
          <div>
            {onConfirm && (
              <Toast.Action
                className={clsx("rounded-full p-2", linkClassName(false))}
                asChild
                altText="Confirm toast."
                onClick={onConfirm}
              >
                <button className="material-symbols-outlined">done</button>
              </Toast.Action>
            )}
            <Toast.Action
              className={clsx("rounded-full p-2", linkClassName(false))}
              asChild
              altText="Close toast."
            >
              <button className="material-symbols-outlined">close</button>
            </Toast.Action>
          </div>
        </Toast.Root>
        <Toast.Viewport className={styles["toast-viewport"]} />
      </Toast.Provider>
    </setShowCtx.Provider>
  );
};
