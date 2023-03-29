import { Button } from "@/components/home/Button";
import { InfoCard } from "@/components/home/InfoCard";
import Loading from "@/components/loading";
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
  loading: () => <Loading />,
});

export async function getStaticProps() {
  return {
    props: {}, // will be passed to the page component as props
  };
}

const InfoCardData = [
  {
    title: "Plugin Driven",
    desc: "Everything in milkdown are plugins. Extend your editor with different types of plugins: syntax, theme, UI, etc.",
  },
  {
    title: "Collaborative",
    desc: "With the support of Y.js, milkdown can be used in real-time collaborative editing.",
  },
  {
    title: "Headless",
    desc: "Milkdown is headless and comes without any CSS. You can easily customize the editor to fit the style of your application.",
  },
  {
    title: "Reliable",
    desc: "Milkdown is built on top of some great libraries, such as ProseMirror, Y.js, and Remark. Which means you can use their community and eco system to get help.",
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Milkdown</title>
      </Head>
      <main className="mx-8 pt-16 md:mx-24 lg:mx-40 xl:mx-80">
        <div className="mt-24 text-center">
          <h1 className="text-4xl font-medium sm:text-6xl xl:text-8xl">
            The{" "}
            <span className="text-nord10 dark:text-nord9">
              WYSIWYG Markdown
            </span>{" "}
            Editor Framework
          </h1>
          <p className="mt-6 text-lg font-light sm:text-2xl">
            🍼 A plugin driven framework to build WYSIWYG Markdown editor.
          </p>
          <div className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href={gettingStarted}>
              <Button primary text="GET STARTED" icon="play_circle" />
            </Link>
            <Link href={playground}>
              <Button text="PLAYGROUND" icon="gamepad" />
            </Link>
            <a
              href="https://github.com/Milkdown/examples"
              target="_blank"
              rel="noreferrer"
            >
              <Button text="EXAMPLES" icon="view_cozy" />
            </a>
            <a
              href="https://github.com/Milkdown/milkdown"
              target="_blank"
              rel="noreferrer"
            >
              <Button text="VIEW ON GITHUB" />
            </a>
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
          {InfoCardData.map((data) => (
            <InfoCard key={data.title} title={data.title} desc={data.desc} />
          ))}
        </div>
      </main>
    </>
  );
}
