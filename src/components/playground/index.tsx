import clsx from "clsx";
import { useAtomCallback } from "jotai/utils";
import dynamic from "next/dynamic";
import { FC, useCallback, useState } from "react";

import Loading from "@/components/loading";

import { cmAPI, crepeAPI, focus } from "./atom";

const PlaygroundMilkdown = dynamic(() => import("./Crepe"), {
  ssr: false,
  loading: () => <Loading />,
});

const ControlPanel = dynamic(() => import("./ControlPanel"), {
  ssr: false,
  loading: () => <Loading />,
});

export const Dual: FC = () => {
  const [expand, setExpand] = useState(false);

  const onMilkdownChange = useAtomCallback(
    useCallback((get, _set, markdown: string) => {
      const cmAPIValue = get(cmAPI);
      const lock = get(focus) === "cm";
      if (lock) return;

      cmAPIValue.update(markdown);
    }, []),
  );

  const onCodemirrorChange = useAtomCallback(
    useCallback((get, _set, getCode: () => string) => {
      const value = getCode();
      const crepeAPIValue = get(crepeAPI);
      crepeAPIValue.update(value);
    }, []),
  );

  return (
    <>
      <div
        className={clsx(
          "h-[calc(50vh-2rem)] md:h-[calc(100vh-72px)]",
          expand
            ? "expanded relative col-span-2 mx-auto mb-24 flex h-fit! min-h-[80vh] w-screen max-w-5xl flex-col border-gray-300 dark:border-gray-600"
            : "fixed left-0 w-full md:bottom-0 md:w-1/2",
        )}
      >
        <PlaygroundMilkdown onChange={onMilkdownChange} />
      </div>
      <div
        className={clsx(
          "h-[calc(50vh-2rem)] border-l border-gray-300 md:h-[calc(100vh-72px)] dark:border-gray-600",
          expand ? "h-0!" : "fixed right-0 bottom-0 w-full md:w-1/2",
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
