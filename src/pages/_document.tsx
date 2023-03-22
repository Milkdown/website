import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* prism theme */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/prism-themes/themes/prism-nord.css"
        />

        {/* katex style */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.13.13/dist/katex.css"
          integrity="sha384-SkMvsJ0Np/CalM0X1hZCccQs6tnLq178/sGoPANiauambU0V/bloCaG3wOXfv+Ef"
          crossOrigin="anonymous"
        />

        {/* Material Symbols, we cannot optional load icon set */}
        {/* eslint-disable-next-line @next/next/google-font-display */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
        />

        {/* favicons for pwa */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#5E81AC" />
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
