import { Crepe } from "@milkdown/crepe";
import { FC, useLayoutEffect, useRef } from "react";

const HomeEditor: FC<{ value: string }> = ({ value }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const loading = useRef(false);

  useLayoutEffect(() => {
    loading.current = true;
    const crepe = new Crepe({
      root: divRef.current,
      defaultValue: value,
      features: {
        [Crepe.Feature.CodeMirror]: false,
        [Crepe.Feature.BlockEdit]: false,
      },
    });
    crepe.create();

    return () => {
      crepe.destroy();
    };
  }, [value]);

  return (
    <div
      ref={divRef}
      className="crepe !h-80 overflow-auto rounded-2xl border border-nord-outline shadow dark:border-nord-outline-dark md:!h-[480px]"
    />
  );
};

export default HomeEditor;
