import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/prism-themes/themes/prism-nord.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.13.13/dist/katex.css"
          integrity="sha384-SkMvsJ0Np/CalM0X1hZCccQs6tnLq178/sGoPANiauambU0V/bloCaG3wOXfv+Ef"
          crossOrigin="anonymous"
        />
        {/* TODO: not load icon like this */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
        />
        {/* TODO: add favicon */}
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Official documentation website for milkdown."
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
