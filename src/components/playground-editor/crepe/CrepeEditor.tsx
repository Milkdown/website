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

  return (
    <>
      <style jsx global>{`
        .crepe .milkdown {
          height: 100%;
          flex: 1;

          --crepe-color-background: #fdfcff;
          --crepe-color-on-background: #1b1c1d;
          --crepe-color-surface: #f8f9ff;
          --crepe-color-surface-low: #f2f3fa;
          --crepe-color-on-surface: #191c20;
          --crepe-color-on-surface-variant: #43474e;
          --crepe-color-outline: #73777f;
          --crepe-color-primary: #37618e;
          --crepe-color-secondary: #d7e3f8;
          --crepe-color-on-secondary: #101c2b;
          --crepe-color-inverse: #2e3135;
          --crepe-color-on-inverse: #eff0f7;
          --crepe-color-inline-code: #ba1a1a;
          --crepe-color-error: #ba1a1a;
          --crepe-color-hover: #eceef4;
          --crepe-color-selected: #e1e2e8;
          --crepe-color-inline-area: #d8dae0;

          --crepe-font-title: Rubik, Cambria, "Times New Roman", Times, serif;
          --crepe-font-default: Inter, Arial, Helvetica, sans-serif;
          --crepe-font-code: "JetBrains Mono", Menlo, Monaco, "Courier New",
            Courier, monospace;

          --crepe-shadow-1: 0px 1px 3px 1px rgba(0, 0, 0, 0.15),
            0px 1px 2px 0px rgba(0, 0, 0, 0.3);
          --crepe-shadow-2: 0px 2px 6px 2px rgba(0, 0, 0, 0.15),
            0px 1px 2px 0px rgba(0, 0, 0, 0.3);
        }

        .dark .crepe .milkdown {
          --crepe-color-background: #1b1c1d;
          --crepe-color-on-background: #f8f9ff;
          --crepe-color-surface: #111418;
          --crepe-color-surface-low: #191c20;
          --crepe-color-on-surface: #e1e2e8;
          --crepe-color-on-surface-variant: #c3c6cf;
          --crepe-color-outline: #8d9199;
          --crepe-color-primary: #a1c9fd;
          --crepe-color-secondary: #3c4858;
          --crepe-color-on-secondary: #d7e3f8;
          --crepe-color-inverse: #e1e2e8;
          --crepe-color-on-inverse: #2e3135;
          --crepe-color-inline-code: #ffb4ab;
          --crepe-color-error: #ffb4ab;
          --crepe-color-hover: #1d2024;
          --crepe-color-selected: #32353a;
          --crepe-color-inline-area: #111418;

          --crepe-font-title: Rubik, Cambria, "Times New Roman", Times, serif;
          --crepe-font-default: Inter, Arial, Helvetica, sans-serif;
          --crepe-font-code: "JetBrains Mono", Menlo, Monaco, "Courier New",
            Courier, monospace;

          --crepe-shadow-1: 0px 1px 2px 0px rgba(255, 255, 255, 0.3),
            0px 1px 3px 1px rgba(255, 255, 255, 0.15);
          --crepe-shadow-2: 0px 1px 2px 0px rgba(255, 255, 255, 0.3),
            0px 2px 6px 2px rgba(255, 255, 255, 0.15);
        }
      `}</style>
      <div className="crepe flex h-full flex-1 flex-col" ref={divRef} />
    </>
  );
};
