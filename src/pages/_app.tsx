import "@docsearch/css";
import "@milkdown/crepe/theme/common/style.css";
import { Analytics } from "@vercel/analytics/react";
import clsx from "clsx";
import NextApp, { AppContext, AppInitialProps } from "next/app";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";

import Footer from "@/components/footer";
import { Header } from "@/components/header";
import PwaUpdater from "@/components/pwa-updater";
import { DocSearchProvider, LayoutProvider } from "@/providers";

import "@milkdown/crepe/theme/common/style.css";
import "@/styles/crepe.css";
import "@/styles/docsearch.css";
import "@/styles/globals.css";
import "@/styles/liquid.css";
import "@/styles/playground.css";
import "@/styles/prose.css";
import "@/styles/prosemirror.css";
import "@/styles/toast.css";
import { DocSearch } from "@/utils/types";

export default function App({
  Component,
  pageProps: { docSearch, ...componentProps },
}: AppPropsWithInitialProps) {
  const router = useRouter();
  const pathname = router.pathname;
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <DocSearchProvider docSearch={docSearch}>
        <LayoutProvider>
          <Header />
          <main
            className={clsx(
              "grow",
              pathname !== "/" ? "mt-[72px]" : "bg-white dark:bg-nord0",
            )}
          >
            <Component {...componentProps} />
          </main>
          <Footer />
          <PwaUpdater />
          <Analytics />
        </LayoutProvider>
      </DocSearchProvider>
    </>
  );
}
App.getInitialProps = async (
  appContext: AppContext,
): Promise<AppInitialProps<{ docSearch: DocSearch }>> => {
  const props = await NextApp.getInitialProps(appContext);
  return {
    ...props,
    pageProps: {
      ...props.pageProps,
      docSearch: {
        appId: process.env.DOCSEARCH_APP_ID || "",
        apiKey: process.env.DOCSEARCH_API_KEY || "",
        indexName: process.env.DOCSEARCH_INDEX_NAME || "",
      },
    },
  };
};

type AppPropsWithInitialProps = AppProps<{ docSearch: DocSearch }>;
