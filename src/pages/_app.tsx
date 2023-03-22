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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LayoutProvider>
      <Nav />
      <Component {...pageProps} />
      <Footer />
      <Analytics />
    </LayoutProvider>
  );
}
