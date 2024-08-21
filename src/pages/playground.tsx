import { CodemirrorRef } from "@/components/codemirror";
import Loading from "@/components/loading";
import type { MilkdownRef } from "@/components/playground-editor";
import { FeatureToggleProvider } from "@/components/playground-editor/FeatureToggleProvider";
import { InspectorProvider } from "@/components/playground-editor/InspectorProvider";
import { ProseStateProvider } from "@/components/playground-editor/ProseStateProvider";
import { ShareProvider } from "@/components/playground-editor/ShareProvider";
import { getPlaygroundTemplate } from "@/pages/api/playground";
import { compose } from "@/utils/compose";
import { decode } from "@/utils/share";
import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react";
import clsx from "clsx";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

const PlaygroundMilkdown = dynamic(
  () =>
    import("@/components/playground-editor").then((module) => ({
      default: module.PlaygroundMilkdown,
    })),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

const ControlPanel = dynamic(
  () =>
    import("@/components/playground/control-panel").then((module) => ({
      default: module.ControlPanel,
    })),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

const Provider = compose(
  FeatureToggleProvider,
  ProsemirrorAdapterProvider,
  ProseStateProvider,
  ShareProvider,
  InspectorProvider
);

export async function getStaticProps() {
  const template = await getPlaygroundTemplate();
  return {
    props: {
      template,
    },
  };
}

export default function Playground({ template }: { template: string }) {
  const [content, setContent] = useState(template);
  const router = useRouter();
  const path = router.asPath;
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    const [_, search = ""] = path.split("?");
    const searchParams = new URLSearchParams(search);
    const text = searchParams.get("text");
    if (text) {
      setContent(decode(text));
    }
  }, [path]);

  const lockCodemirror = useRef(false);
  const milkdownRef = useRef<MilkdownRef>(null);
  const codemirrorRef = useRef<CodemirrorRef>(null);

  const onMilkdownChange = useCallback((markdown: string) => {
    const lock = lockCodemirror.current;
    if (lock) return;

    const codemirror = codemirrorRef.current;
    if (!codemirror) return;
    codemirror.update(markdown);
  }, []);

  const onCodemirrorChange = useCallback((getCode: () => string) => {
    const { current } = milkdownRef;
    if (!current) return;
    const value = getCode();
    current.update(value);
  }, []);

  return (
    <>
      <Head>
        <title>Playground | Milkdown</title>
      </Head>
      <div className="m-0 grid border-b border-gray-300 dark:border-gray-600 md:mt-0 md:grid-cols-2">
        <Provider>
          <div
            className={clsx(
              "h-[calc(50vh-2rem)] overflow-auto overscroll-none md:h-[calc(100vh-72px)]",
              expand &&
                "expanded col-span-2 mx-auto mt-16 mb-24 flex !h-fit min-h-[80vh] w-full max-w-5xl flex-col border-gray-300 drop-shadow-md dark:border-gray-600"
            )}
          >
            <PlaygroundMilkdown
              milkdownRef={milkdownRef}
              content={content}
              onChange={onMilkdownChange}
            />
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
              codemirrorRef={codemirrorRef}
              content={content}
              onChange={onCodemirrorChange}
              lock={lockCodemirror}
            />
          </div>
        </Provider>
      </div>
    </>
  );
}
