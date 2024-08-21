import { useSetShare } from "@/components/playground-editor/ShareProvider";
import { useToast } from "@/components/toast";
import { useDarkMode } from "@/providers";
import { encode } from "@/utils/share";
import { Crepe } from "@milkdown/crepe";
import { eclipse } from "@uiw/codemirror-theme-eclipse";
import {
  FC,
  MutableRefObject,
  RefObject,
  useLayoutEffect,
  useRef,
} from "react";

import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import throttle from "lodash.throttle";
import { getMarkdown } from "@milkdown/kit/utils";
import { useRouter } from "next/navigation";

export type CrepeEditorProps = {
  defaultValue: string;
  onChange: (markdown: string) => void;
  crepeRef: RefObject<Crepe>;
};

export const CrepeEditor: FC<CrepeEditorProps> = ({
  crepeRef,
  defaultValue,
  onChange,
}) => {
  const darkMode = useDarkMode();
  const divRef = useRef<HTMLDivElement>(null);
  const loading = useRef(false);
  const setShare = useSetShare();
  const toast = useToast();
  const router = useRouter();

  useLayoutEffect(() => {
    if (!divRef.current || loading.current) return;

    loading.current = true;
    const crepe = new Crepe({
      root: divRef.current,
      defaultValue,
      featureConfigs: {
        [Crepe.Feature.CodeMirror]: {
          theme: darkMode ? undefined : eclipse,
        },
      },
    });

    crepe.editor
      .config((ctx) => {
        ctx.get(listenerCtx).markdownUpdated(
          throttle((_, markdown) => {
            onChange(markdown);
          }, 200)
        );
      })
      .use(listener);

    crepe.create().then(() => {
      (crepeRef as MutableRefObject<Crepe>).current = crepe;
      loading.current = false;
    });

    setShare(() => () => {
      const content = crepe.editor.action(getMarkdown());
      const base64 = encode(content);

      const url = new URL(location.href);
      url.searchParams.set("text", base64);
      navigator.clipboard.writeText(url.toString());
      toast("Share link copied.", "success");
      router.replace(url.toString());
    });

    return () => {
      if (loading.current) return;
      crepe.destroy();
    };
  }, [crepeRef, defaultValue, darkMode, onChange, setShare, toast, router]);

  return <div className="crepe flex h-full flex-1 flex-col" ref={divRef} />;
};
