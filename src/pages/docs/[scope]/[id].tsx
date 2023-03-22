import { getDocById } from "@/pages/api/docs";
import { docConfig } from "@/routes";
import { toTitle } from "@/utils/title";
import { MilkdownProvider } from "@milkdown/react";
import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import type { FC } from "react";

const Doc = dynamic(() => import("@/components/doc-editor"), { ssr: false });

type Params = {
  params: {
    id: string;
    scope: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const { id, scope } = params;
  const content = await getDocById(id, scope);
  return {
    props: {
      content,
    },
  };
}

export async function getStaticPaths() {
  const paths = docConfig.flatMap(({ items, dir: scope }) =>
    items.map((id) => ({
      params: {
        id,
        scope,
      },
    }))
  );
  return {
    paths,
    fallback: false,
  };
}

const DocRenderer: FC<{ content: string }> = ({ content }) => {
  const router = useRouter();
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{toTitle(router.query.id as string)} | Milkdown</title>
      </Head>
      <div className="mx-8 pt-16 md:mx-24 lg:mx-40 xl:mx-80">
        <MilkdownProvider>
          <ProsemirrorAdapterProvider>
            <Doc content={content} />
          </ProsemirrorAdapterProvider>
        </MilkdownProvider>
      </div>
    </>
  );
};

export default DocRenderer;
