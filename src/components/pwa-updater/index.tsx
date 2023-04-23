import { useToast } from "@/components/toast";
import { useEffect } from "react";
import type { Workbox } from "workbox-window";

declare global {
  interface Window {
    workbox: Workbox;
  }
}

export default function PwaUpdater() {
  const toast = useToast();
  useEffect(() => {
    const hasWorkbox =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.workbox !== undefined;

    if (!hasWorkbox) return;

    const wb = window.workbox;
    const promptNewVersionAvailable = () => {
      // `event.wasWaitingBeforeRegister` will be false if this is the first time the updated service worker is waiting.
      // When `event.wasWaitingBeforeRegister` is true, a previously updated service worker is still waiting.
      // You may want to customize the UI prompt accordingly.
      toast("New version available, reload to update", "info", () => {
        wb.addEventListener("controlling", () => {
          window.location.reload();
        });

        // Send a message to the waiting service worker, instructing it to activate.
        wb.messageSkipWaiting();
      });
    };

    wb.addEventListener("waiting", promptNewVersionAvailable);

    wb.register();
  }, [toast]);

  return <></>;
}
