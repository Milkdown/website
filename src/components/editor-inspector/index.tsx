import { renderTreemap } from "@/components/editor-inspector/treemap";
import { useInspector } from "@/components/playground-editor/InspectorProvider";
import { renderTimeline } from "./timeline";
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

const useTreemap = () => {
  const inspector = useInspector();

  return useCallback(
    (container: HTMLDivElement) => {
      if (!container || inspector.length === 0) return;

      const observer = new ResizeObserver(() => {
        container.innerHTML = "";

        renderTreemap(container, inspector);
      });

      observer.observe(container);
    },
    [inspector]
  );
};

export default function EditorInspector() {
  const timelineRef = useTimeline();
  const treemapRef = useTreemap();
  return (
    <>
      <div
        className="relative fill-nord-0 font-sans text-xs text-nord-0 dark:fill-nord-6 dark:text-nord-6"
        ref={timelineRef}
      />
      <div
        className="relative fill-nord-0 font-sans text-[9px] text-nord-0"
        ref={treemapRef}
      />
    </>
  );
}
