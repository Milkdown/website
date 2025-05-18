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
      <div className="prose prose-sm dark:prose-invert sm:prose-base xl:prose-lg mx-auto px-8 pb-10 pt-24 md:pb-24">
        <h1>Milkdown Blog</h1>
        <p>
          This blog is the official source for updates, ideas and fun stuffs
          from Milkdown.
        </p>

        <div className="flex flex-col gap-6">
          {blogConfig.map(({ id, desc, date, author }) => (
            <section key={id}>
              <Link href={`/blog/${id}`} className="no-underline">
                <h3 className="text-nord10 hover:text-nord8 dark:text-nord9 dark:hover:text-nord8">
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
