import { emojiSlash } from "@/components/emoji-menu/config";
import { editorViewCtx, rootDOMCtx } from "@milkdown/core";
import { Ctx } from "@milkdown/ctx";
import { Instance } from "@milkdown/react";
import { gemoji } from "gemoji";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const useSlashState = (instance: Instance) => {
  const [loading, getEditor] = instance;
  const [selected, setSelected] = useState(0);
  const selectedRef = useRef(0);
  const [search, setSearch] = useState("");

  const emojis = useMemo(() => {
    if (search.length === 0) return [];
    return gemoji
      .filter((emoji) => {
        return emoji.names.some((name) => name.includes(search));
      })
      .slice(0, 10);
  }, [search]);

  const onPick = useCallback(
    (ctx: Ctx) => {
      const target = emojis[selected];
      if (!target) return;
      const view = ctx.get(editorViewCtx);
      const { state } = view;
      const { selection } = state;
      view.dispatch(
        view.state.tr
          .delete(selection.from - search.length - 1, selection.from)
          .insertText(target.emoji)
      );
    },
    [emojis, search.length, selected]
  );

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
        ctx.update(emojiSlash.key, (spec) => ({
          ...spec,
          opened,
        }));
      });
    },
    [getEditor]
  );

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      const editor = getEditor();
      const opened = editor?.ctx.get(emojiSlash.key).opened;
      if (!opened) return;

      const key = e.key;
      if (key === "ArrowDown") {
        setSelected((s) => (s + 1) % emojis.length);
        return;
      }
      if (key === "ArrowUp") {
        setSelected((s) => (s - 1 + emojis.length) % emojis.length);
        return;
      }
      if (key === "Enter") {
        getEditor()?.action(onPick);
      }
    };

    root?.addEventListener("keydown", onKeydown);
    return () => {
      root?.removeEventListener("keydown", onKeydown);
    };
  }, [emojis.length, getEditor, onPick, root]);

  return {
    root,
    setOpened,
    setSelected,
    selected,
    setSearch,
    onPick,
    emojis,
  };
};
