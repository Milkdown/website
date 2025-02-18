import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react";
import Head from "next/head";
import { useRouter } from "next/router";
import type { FC } from "react";

import Doc from "@/components/doc-editor";
import { getDocById } from "@/pages/api/docs";
import { docConfig } from "@/routes";
import { toTitle } from "@/utils/title";

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
  const paths = docConfig.flatMap(({ items, scope, dir }) =>
    items.map(
      (id): Params => ({
        params: {
          id,
          scope,
        },
      }),
    ),
  );
  return {
    paths,
    fallback: false,
  };
}

function getEditUrl(id: string, scope: string) {
  const dir = docConfig.find((item) => item.scope === scope)?.dir ?? scope;

  return `https://github.com/Milkdown/website/edit/main/docs/${dir}/${id}.md`;
}

const DocRenderer: FC<{ content: string }> = ({ content }) => {
  const router = useRouter();
  const { id, scope } = router.query;
  const url = getEditUrl(id as string, scope as string);
  const originalTitle = toTitle(id as string);
  const title = `${originalTitle} | Milkdown`;
  const ogUrl = `https://milkdown.dev/${router.asPath}`;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:url" content={ogUrl} />
        <meta property="og:title" content={originalTitle} />
        <meta property="twitter:title" content={originalTitle} />
        <meta
          property="og:description"
          content={content.slice(0, 100) + "..."}
        />
      </Head>
      <div className="mx-8 pb-10 pt-24 md:mx-24 md:pb-24 lg:mx-40 xl:mx-80 2xl:mx-auto 2xl:max-w-4xl">
        <ProsemirrorAdapterProvider>
          <Doc url={url} content={content} />
        </ProsemirrorAdapterProvider>
      </div>
    </>
  );
};

export default DocRenderer;
