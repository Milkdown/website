import { iframePlugin } from "./iframePlugin";
import Outline from "@/components/outline";
import { useDarkMode } from "@/providers";
import { editorViewCtx, editorViewOptionsCtx } from "@milkdown/kit/core";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { Crepe } from "@milkdown/crepe";
import { outline } from "@milkdown/kit/utils";
import { FC, useEffect, useRef, useState } from "react";
import { eclipse } from "@uiw/codemirror-theme-eclipse";

import { Button } from "./Button";

const Doc: FC<{ content: string; url: string }> = ({ content, url }) => {
  const [outlines, setOutlines] = useState<
    { text: string; level: number; id: string }[]
  >([]);
  const darkMode = useDarkMode();
  const divRef = useRef<HTMLDivElement>(null);
  const loading = useRef(false);

  useEffect(() => {
    if (!divRef.current || loading.current) return;
    loading.current = true;
    const crepe = new Crepe({
      root: divRef.current,
      defaultValue: content,
      features: {
        [Crepe.Feature.BlockEdit]: false,
      },
      featureConfigs: {
        [Crepe.Feature.CodeMirror]: {
          theme: darkMode ? undefined : eclipse,
        },
      },
    });
    const editor = crepe.editor;
    editor
      .config((ctx) => {
        ctx.set(editorViewOptionsCtx, {
          attributes: {
            class: "w-full max-w-full box-border overflow-hidden p-4",
            spellcheck: "false",
          },
        });

        ctx
          .get(listenerCtx)
          .mounted((ctx) => {
            setOutlines(outline()(ctx));
          })
          .markdownUpdated((ctx) => {
            const view = ctx.get(editorViewCtx);
            if (view.state?.doc) setOutlines(outline()(ctx));
          });
      })
      .use(iframePlugin)
      .use(listener);

    crepe.create().then(() => {
      loading.current = false;
    });

    return () => {
      if (loading.current) return;
      crepe.destroy();
    };
  }, [content, darkMode]);

  return (
    <>
      <div className="crepe crepe-doc" ref={divRef} />
      <div className="fixed inset-y-32 right-20 hidden flex-col gap-4 overflow-y-auto xl:flex xl:w-60 2xl:right-[calc(50vw-28rem-15rem)]">
        <a className="float-right" href={url} target="_blank">
          <Button primary text="Edit on github" icon="edit" />
        </a>
        <Outline items={outlines} />
      </div>
    </>
  );
};

export default Doc;
