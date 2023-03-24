import { MilkdownProvider } from "@milkdown/react";
import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";

const gettingStarted = "/docs/guide/getting-started";
const playground = "/playground";

const doc = `
# Like this one

> I'll see you on the dark side of the moon.  -- Roger Waters

Try it out by typing in here, or visiting the [online playground](/playground).
`;

const HomeEditor = dynamic(() => import("@/components/home-editor"), {
  ssr: false,
});

export async function getStaticProps() {
  return {
    props: {}, // will be passed to the page component as props
  };
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Milkdown</title>
      </Head>
      <main className="mx-8 pt-16 md:mx-24 lg:mx-40 xl:mx-80">
        <div className="mt-24 text-center">
          <h1 className="text-4xl font-medium sm:text-6xl xl:text-8xl">
            The <span className="text-nord10">WYSIWYG Markdown</span> Editor
            Framework
          </h1>
          <p className="mt-6 text-lg font-light sm:text-2xl">
            🍼 A plugin driven framework to build WYSIWYG Markdown editor.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <div className="flex justify-center gap-4">
              <Link href={gettingStarted}>
                <button className="inline-flex h-14 items-center rounded-2xl bg-nord10 py-4 px-5 text-gray-50 shadow-md hover:bg-nord9 hover:shadow-lg">
                  <span className="material-symbols-outlined mr-3 text-base">
                    play_circle
                  </span>
                  <span className="text-sm">GET STARTED</span>
                </button>
              </Link>
              <Link href={playground}>
                <button className="hover-shadow-lg inline-flex h-14 items-center rounded-2xl bg-gray-200 py-4 px-5 shadow-md hover:bg-gray-100 dark:bg-nord3 hover:dark:bg-nord1">
                  <span className="material-symbols-outlined mr-3 text-base">
                    gamepad
                  </span>
                  <span className="text-sm">PLAYGROUND</span>
                </button>
              </Link>
            </div>
            <div className="flex justify-center gap-4">
              <a
                href="https://github.com/Milkdown/examples"
                target="_blank"
                rel="noreferrer"
              >
                <button className="hover-shadow-lg inline-flex h-14 items-center rounded-2xl bg-gray-200 py-4 px-5 shadow-md hover:bg-gray-100 dark:bg-nord3 hover:dark:bg-nord1">
                  <span className="material-symbols-outlined mr-3 text-base">
                    view_cozy
                  </span>
                  <span className="text-sm">EXAMPLES</span>
                </button>
              </a>
              <a
                href="https://github.com/Milkdown/milkdown"
                target="_blank"
                rel="noreferrer"
              >
                <button className="hover-shadow-lg inline-flex h-14 items-center rounded-2xl bg-gray-200 py-4 px-5 shadow-md hover:bg-gray-100 dark:bg-nord3 hover:dark:bg-nord1">
                  <span className="text-sm">VIEW ON GITHUB</span>
                </button>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-24">
          <MilkdownProvider>
            <ProsemirrorAdapterProvider>
              <HomeEditor value={doc.trim()} />
            </ProsemirrorAdapterProvider>
          </MilkdownProvider>
        </div>
        <div className="mt-24 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex-1/2 rounded-2xl bg-gray-50 py-3 px-4 dark:bg-nord3">
            <div className="text-xl font-bold">Plugin Driven</div>
            <p className="mt-7 font-light">
              Everything in milkdown are plugins. Extend your editor with
              different types of plugins: syntax, theme, UI, etc.
            </p>
          </div>
          <div className="flex-1/2 rounded-2xl bg-gray-50 py-3 px-4 dark:bg-nord3">
            <div className="text-xl font-bold">Collaborative</div>
            <p className="mt-7 font-light">
              With the support of Y.js, milkdown can be used in real-time
              collaborative editing.
            </p>
          </div>
          <div className="flex-1/2 rounded-2xl bg-gray-50 py-3 px-4 dark:bg-nord3">
            <div className="text-xl font-bold">Headless</div>
            <p className="mt-7 font-light">
              Milkdown is headless and comes without any CSS. You can easily
              customize the editor to fit the style of your application.
            </p>
          </div>
          <div className="flex-1/2 rounded-2xl bg-gray-50 py-3 px-4 dark:bg-nord3">
            <div className="text-xl font-bold">Reliable</div>
            <p className="mt-7 font-light">
              Milkdown is built on top of some great libraries, such as
              ProseMirror, Y.js, and Remark. Which means you can use their
              community and eco system to get help.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
