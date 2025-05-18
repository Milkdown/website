import { Crepe } from "@milkdown/crepe";
import { FC, useLayoutEffect, useRef } from "react";

import { useToast } from "../toast";

const HomeEditor: FC<{ value: string }> = ({ value }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const loading = useRef(false);
  const toast = useToast();

  useLayoutEffect(() => {
    if (!divRef.current) return;
    loading.current = true;
    const crepe = new Crepe({
      root: divRef.current,
      defaultValue: value,
      features: {
        [Crepe.Feature.CodeMirror]: false,
        [Crepe.Feature.Latex]: false,
        [Crepe.Feature.BlockEdit]: false,
      },
      featureConfigs: {
        [Crepe.Feature.LinkTooltip]: {
          onCopyLink: () => {
            toast("Link copied", "success");
          },
        },
      },
    });
    crepe.create().then(() => {
      loading.current = false;
    });

    return () => {
      crepe.destroy();
    };
  }, [toast, value]);

  return (
    <div
      ref={divRef}
      className="crepe border-nord-outline dark:border-nord-outline-dark h-80! overflow-auto rounded-2xl border shadow-sm md:h-[480px]!"
    />
  );
};

export default HomeEditor;
