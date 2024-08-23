import Loading from "@/components/loading";
import clsx from "clsx";
import { useAtomCallback } from "jotai/utils";
import dynamic from "next/dynamic";
import { FC, useCallback, useState } from "react";
import { cmAPI, crepeAPI, focus } from "./atom";

const PlaygroundMilkdown = dynamic(
  () =>
    import("./Crepe").then((module) => ({
      default: module.PlaygroundMilkdown,
    })),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

const ControlPanel = dynamic(
  () =>
    import("./ControlPanel").then((module) => ({
      default: module.ControlPanel,
    })),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export const Dual: FC = () => {
  const [expand, setExpand] = useState(false);

  const onMilkdownChange = useAtomCallback(
    useCallback((get, _set, markdown: string) => {
      const cmAPIValue = get(cmAPI);
      const lock = get(focus) === "cm";
      if (lock) return;

      cmAPIValue.update(markdown);
    }, [])
  );

  const onCodemirrorChange = useAtomCallback(
    useCallback((get, _set, getCode: () => string) => {
      const value = getCode();
      const crepeAPIValue = get(crepeAPI);
      crepeAPIValue.update(value);
    }, [])
  );

  return (
    <>
      <div
        className={clsx(
          "relative h-[calc(50vh-2rem)] overflow-auto overscroll-none md:h-[calc(100vh-72px)]",
          expand &&
            "expanded col-span-2 mx-auto mt-16 mb-24 flex !h-fit min-h-[80vh] w-full max-w-5xl flex-col border-gray-300 dark:border-gray-600"
        )}
      >
        <PlaygroundMilkdown onChange={onMilkdownChange} />
      </div>
      <div
        className={clsx(
          "h-[calc(50vh-2rem)] overflow-y-scroll overscroll-none border-l border-gray-300 dark:border-gray-600 md:h-[calc(100vh-72px)]",
          expand && "!h-0"
        )}
      >
        <ControlPanel
          hide={expand}
          setHide={setExpand}
          onChange={onCodemirrorChange}
        />
      </div>
    </>
  );
};
