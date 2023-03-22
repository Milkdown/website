import Footer from "@/components/footer";
import Nav from "@/components/nav";
import { LayoutProvider } from "@/providers";
import type { AppProps } from "next/app";

import "@milkdown/theme-nord/style.css";

import "@/styles/globals.css";
import "@/styles/docsearch.css";
import "@/styles/prosemirror.css";
import "@/styles/prose.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LayoutProvider>
      <Nav />
      <Component {...pageProps} />
      <Footer />
    </LayoutProvider>
  );
}
