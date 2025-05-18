import Head from "next/head";
import Link from "next/link";

import { blogConfig } from "@/routes/blog-config";
import { toTitle } from "@/utils/title";

export async function getStaticProps() {
  return {
    props: {}, // will be passed to the page component as props
  };
}

export default function Blogs() {
  return (
    <>
      <Head>
        <title>Blog | Milkdown</title>
      </Head>
      <div className="mx-8 w-full pt-24 pb-10 md:mx-24 md:pb-24 lg:mx-40 xl:mx-80 2xl:mx-auto 2xl:max-w-4xl">
        <h1 className="text-4xl">Milkdown Blog</h1>
        <p className="font-light text-gray-500 dark:text-gray-400">
          This blog is the official source for updates, ideas and fun stuffs
          from Milkdown.
        </p>

        <div className="mt-8 flex flex-col gap-8">
          {blogConfig.map(({ id, desc, date, author }) => (
            <section key={id} className="pb-8">
              <Link href={`/blog/${id}`} className="no-underline">
                <h3 className="text-nord10 hover:text-nord8 dark:text-nord9 dark:hover:text-nord8 mb-1 text-2xl">
                  {toTitle(id)}
                </h3>
              </Link>
              <div className="font-serif text-sm text-gray-500 dark:text-gray-400">
                {date}
                <span className="mx-1">|</span>
                {author.join(", ")}
              </div>
              <p className="mt-2!">{desc}</p>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
