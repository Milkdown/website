import { useInspector } from "@/components/playground-editor/InspectorProvider";
import { renderTimeline } from "@/components/playground/control-panel/timeline";
import { useDarkMode } from "@/providers";
import { useCallback } from "react";

const useTimeline = () => {
  const inspector = useInspector();
  const darkMode = useDarkMode();

  return useCallback(
    (container: HTMLDivElement) => {
      if (!container || inspector.length === 0) return;

      const observer = new ResizeObserver(() => {
        container.innerHTML = "";

        renderTimeline(container, inspector, darkMode);
      });

      observer.observe(container);
    },
    [inspector, darkMode]
  );
};

export default function EditorInspector() {
  const ref = useTimeline();
  return (
    <div
      className="relative h-full fill-nord-0 font-sans text-xs text-nord-0 dark:fill-nord-6 dark:text-nord-6"
      ref={ref}
    />
  );
}
