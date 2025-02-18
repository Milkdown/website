import { useAtom, useSetAtom } from "jotai";
import { useAtomCallback } from "jotai/utils";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef } from "react";

import { mobileSidebarOpen, mobileSidebarScope } from "./atom";

export function useSidebar() {
  const [open, setOpen] = useAtom(mobileSidebarOpen);
  const setScope = useSetAtom(mobileSidebarScope);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const location = router.asPath;
  const scope = router.query.scope;

  const closeCallback = useAtomCallback(
    useCallback((get, set, event: Event) => {
      const target = event.target as HTMLElement;
      const open = get(mobileSidebarOpen);
      if (open) {
        if (
          sidebarRef.current?.contains(target) ||
          buttonRef.current?.contains(target)
        ) {
          return;
        }
        event.preventDefault();
        set(mobileSidebarOpen, false);
      }
      return;
    }, []),
  );

  useEffect(() => {
    setOpen(false);
  }, [setOpen, location]);

  useEffect(() => {
    window.addEventListener("click", closeCallback, { capture: true });
    return () => {
      window.removeEventListener("click", closeCallback);
    };
  }, [closeCallback]);

  useEffect(() => {
    document.body.classList.toggle("overflow-y-hidden", open);
    if (!open) {
      setScope(typeof scope === "string" ? scope : "");
    }
  }, [open, scope, setScope]);

  return { buttonRef, sidebarRef };
}
