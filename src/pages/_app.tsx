import Footer from "@/components/footer";
import Nav from "@/components/nav";
import { LayoutProvider } from "@/providers";
import "@/styles/docsearch.css";

import "@/styles/globals.css";
import "@/styles/prose.css";
import "@/styles/prosemirror.css";

import "@milkdown/theme-nord/style.css";
import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <LayoutProvider>
        <Nav />
        <Component {...pageProps} />
        <Footer />
        <Analytics />
      </LayoutProvider>
    </>
  );
}
