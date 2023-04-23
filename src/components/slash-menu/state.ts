import { config, slash } from "@/components/slash-menu/config";
import { rootDOMCtx } from "@milkdown/core";
import { Instance } from "@milkdown/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const useSlashState = (instance: Instance) => {
  const [loading, getEditor] = instance;
  const [selected, setSelected] = useState(0);
  const selectedRef = useRef(0);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  const root = useMemo(() => {
    if (loading) return undefined;
    try {
      return getEditor().ctx.get(rootDOMCtx);
    } catch {
      return undefined;
    }
  }, [getEditor, loading]);

  const setOpened = useCallback(
    (opened: boolean) => {
      getEditor()?.action((ctx) => {
        ctx.update(slash.key, (spec) => ({
          ...spec,
          opened,
        }));
      });
    },
    [getEditor]
  );

  const onKeydown = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key;
      if (key === "ArrowDown") {
        setSelected((s) => (s + 1) % config.length);
        return;
      }
      if (key === "ArrowUp") {
        setSelected((s) => (s - 1 + config.length) % config.length);
        return;
      }
      getEditor()?.action(config[selectedRef.current].onSelect);
    },
    [getEditor]
  );

  return {
    root,
    setOpened,
    onKeydown,
    setSelected,
    selected,
  };
};
