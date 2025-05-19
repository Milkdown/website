import { Crepe } from "@milkdown/crepe";
import { editorViewCtx, parserCtx } from "@milkdown/kit/core";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { Slice } from "@milkdown/kit/prose/model";
import { Selection } from "@milkdown/kit/prose/state";
import { getMarkdown } from "@milkdown/kit/utils";
import { eclipse } from "@uiw/codemirror-theme-eclipse";
import { useAtomValue, useSetAtom } from "jotai";
import throttle from "lodash.throttle";
import { FC, MutableRefObject, useLayoutEffect, useRef } from "react";

import { useToast } from "@/components/toast";
import { useDarkMode } from "@/providers";
import { encode } from "@/utils/share";

import { crepeAPI, markdown } from "./atom";

interface MilkdownProps {
  onChange: (markdown: string) => void;
}

const CrepeEditor: FC<MilkdownProps> = ({ onChange }) => {
  const crepeRef = useRef<Crepe>(null);
  const darkMode = useDarkMode();
  const divRef = useRef<HTMLDivElement>(null);
  const loading = useRef(false);
  const toast = useToast();
  const content = useAtomValue(markdown);
  const setCrepeAPI = useSetAtom(crepeAPI);

  useLayoutEffect(() => {
    if (!divRef.current || loading.current) return;

    loading.current = true;
    const crepe = new Crepe({
      root: divRef.current,
      defaultValue: content,
      featureConfigs: {
        [Crepe.Feature.CodeMirror]: {
          theme: darkMode ? undefined : eclipse,
        },
        [Crepe.Feature.LinkTooltip]: {
          onCopyLink: () => {
            toast("Link copied", "success");
          },
        },
      },
    });

    crepe.editor
      .config((ctx) => {
        ctx.get(listenerCtx).markdownUpdated(
          throttle((_, markdown) => {
            onChange(markdown);
          }, 200),
        );
      })
      .use(listener);

    crepe.create().then(() => {
      (crepeRef as MutableRefObject<Crepe>).current = crepe;
      loading.current = false;
    });

    setCrepeAPI({
      loaded: true,
      onShare: () => {
        const content = crepe.editor.action(getMarkdown());
        const base64 = encode(content);

        const url = new URL(location.href);
        url.searchParams.set("text", base64);
        navigator.clipboard.writeText(url.toString()).then(() => {
          toast("Share link copied.", "success");
        });
        window.history.pushState({}, "", url.toString());
      },
      update: (markdown: string) => {
        const crepe = crepeRef.current;
        if (!crepe) return;
        if (crepe.getMarkdown() === markdown) return;
        crepe.editor.action((ctx) => {
          const view = ctx.get(editorViewCtx);
          const parser = ctx.get(parserCtx);
          const doc = parser(markdown);
          if (!doc) return;
          const state = view.state;
          const selection = state.selection;
          const { from } = selection;
          let tr = state.tr;
          tr = tr.replace(
            0,
            state.doc.content.size,
            new Slice(doc.content, 0, 0),
          );
          const docSize = doc.content.size;
          const safeFrom = Math.min(from, docSize - 2);
          tr = tr.setSelection(Selection.near(tr.doc.resolve(safeFrom)));
          view.dispatch(tr);
        });
      },
    });

    return () => {
      if (loading.current) return;
      crepe.destroy();
      setCrepeAPI({
        loaded: false,
        onShare: () => {},
        update: () => {},
      });
    };
  }, [content, darkMode, onChange, setCrepeAPI, toast]);

  return <div className="crepe flex h-full flex-1 flex-col" ref={divRef} />;
};

export default CrepeEditor;
