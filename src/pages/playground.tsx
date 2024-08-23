import { Dual } from "@/components/playground";
import { markdown } from "@/components/playground/atom";
import { getPlaygroundTemplate } from "@/pages/api/playground";
import { decode } from "@/utils/share";
import { useHydrateAtoms } from "jotai/utils";
import Head from "next/head";
import { ReactElement } from "react";
import { useRouter } from "next/router";

export async function getStaticProps() {
  const template = await getPlaygroundTemplate();
  return {
    props: {
      template,
    },
  };
}

const HydrateAtoms = ({
  children,
  template,
}: {
  children: ReactElement;
  template: string;
}) => {
  const router = useRouter();
  const path = router.asPath;
  const [_, search = ""] = path.split("?");
  const searchParams = new URLSearchParams(search);
  const text = searchParams.get("text");
  const value = text ? decode(text) : template;

  useHydrateAtoms([[markdown, value]]);

  return children;
};

export default function Playground({ template }: { template: string }) {
  return (
    <>
      <Head>
        <title>Playground | Milkdown</title>
      </Head>
      <div className="m-0 grid border-b border-gray-300 dark:border-gray-600 md:mt-0 md:grid-cols-2">
        <HydrateAtoms template={template}>
          <Dual />
        </HydrateAtoms>
      </div>
    </>
  );
}
