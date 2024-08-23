import { useDarkMode } from "@/providers";
import { useAtomValue, useSetAtom } from "jotai";
import { FC, useLayoutEffect, useRef } from "react";
import { cmAPI, markdown, focus } from "../atom";
import { createCodeMirrorState, createCodeMirrorView } from "./setup";

export interface CodemirrorProps {
  onChange: (getString: () => string) => void;
}
export const Codemirror: FC<CodemirrorProps> = ({ onChange }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const dark = useDarkMode();
  const content = useAtomValue(markdown);
  const setCmAPI = useSetAtom(cmAPI);
  const setFocus = useSetAtom(focus);

  useLayoutEffect(() => {
    if (!divRef.current) return;

    const editor = createCodeMirrorView({
      root: divRef.current,
      onChange,
      setFocus,
      content,
      dark,
    });
    setCmAPI({
      loaded: true,
      update: (markdown: string) => {
        const state = createCodeMirrorState({
          onChange,
          setFocus,
          dark,
          content: markdown,
        });
        editor.setState(state);
      },
    });

    return () => {
      editor.destroy();
      setCmAPI({
        loaded: false,
        update: () => {},
      });
    };
  }, [onChange, content, dark, setCmAPI, setFocus]);

  return <div className="h-full bg-gray-50 dark:bg-gray-900" ref={divRef} />;
};
