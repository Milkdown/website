import { CodemirrorRef } from "@/components/codemirror";
import Loading from "@/components/loading";
import type { MilkdownRef } from "@/components/playground-editor";
import { FeatureToggleProvider } from "@/components/playground-editor/FeatureToggleProvider";
import { ProseStateProvider } from "@/components/playground-editor/ProseStateProvider";
import { ShareProvider } from "@/components/playground-editor/ShareProvider";
import { compose } from "@/utils/compose";
import { decode } from "@/utils/share";
import { MilkdownProvider } from "@milkdown/react";
import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react";
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
  MilkdownProvider,
  ProsemirrorAdapterProvider,
  ProseStateProvider,
  ShareProvider
);

export async function getStaticProps() {
  return {
    props: {},
  };
}

export default function Playground() {
  const [content, setContent] = useState("");
  const router = useRouter();
  const path = router.asPath;

  useEffect(() => {
    const [_, search = ""] = path.split("?");
    const searchParams = new URLSearchParams(search);
    const text = searchParams.get("text");
    let importing = true;
    if (text) {
      setContent(decode(text));
    } else {
      fetch("/api/playground")
        .then((res) => res.json())
        .then(({ content }) => {
          setContent(content);
        });
    }

    return () => {
      importing = false;
    };
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
      <div className="m-0 mt-16 grid border-b border-gray-300 dark:border-gray-600 md:ml-20 md:mt-0 md:grid-cols-2">
        <Provider>
          <div className="h-[calc(50vh-2rem)] overflow-auto overscroll-none md:h-screen">
            <PlaygroundMilkdown
              milkdownRef={milkdownRef}
              content={content}
              onChange={onMilkdownChange}
            />
          </div>
          <div className="h-[calc(50vh-2rem)] overflow-auto overscroll-none border-l border-gray-300 dark:border-gray-600 md:h-screen">
            <ControlPanel
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
