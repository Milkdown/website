import Link from "next/link";
import { FC } from "react";
import Image from "next/image";
import vercelBanner from "./vercel-banner.svg";

type LinkGroupsProps = {
  title: string;
  items: Array<{ text: string; link: string }>;
};

const LinkGroups: FC<LinkGroupsProps> = ({ title, items }) => {
  return (
    <div>
      <div className="mb-5 text-xl">{title}</div>
      {items.map((item, i) => (
        <div
          key={i.toString()}
          className="mb-2 text-nord10 hover:text-nord8 dark:text-nord9 hover:dark:text-nord7"
        >
          <a href={item.link}>{item.text}</a>
        </div>
      ))}
    </div>
  );
};

const communityGroup = {
  title: "Community",
  items: [
    {
      text: "Discord",
      link: "https://discord.gg/SdMnrSMyBX",
    },
    {
      text: "Twitter",
      link: "https://twitter.com/SaulMirone",
    },
    {
      text: "Github",
      link: "https://github.com/Milkdown/milkdown",
    },
  ],
};

const linksGroup = {
  title: "Links",
  items: [
    {
      text: "Prosemirror",
      link: "https://prosemirror.net/",
    },
    {
      text: "Remark",
      link: "https://remark.js.org/",
    },
    {
      text: "Markdown",
      link: "https://en.wikipedia.org/wiki/Markdown",
    },
  ],
};

const moreGroup = {
  title: "More",
  items: [
    {
      text: "License",
      link: "https://github.com/Milkdown/milkdown/blob/main/LICENSE",
    },
    {
      text: "Contributors",
      link: "https://github.com/Milkdown/milkdown/graphs/contributors",
    },
    {
      text: "Code of Conduct",
      link: "https://github.com/Milkdown/milkdown/blob/main/CODE_OF_CONDUCT.md",
    },
  ],
};

const Footer: FC = () => {
  const root = "/";
  return (
    <footer className="mt-24 w-full self-end bg-gray-200 py-12 dark:bg-gray-700">
      <div className="mx-8 md:mx-24 lg:mx-40 xl:mx-80">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <div
            className="mr-auto flex h-20 w-20 cursor-pointer items-center justify-center
            rounded-full border-2
            border-gray-300 bg-white shadow-inner hover:bg-gray-200 dark:border-gray-600
            dark:bg-gray-800 hover:dark:bg-gray-700"
          >
            <Link href={root}>
              <Image
                width={48}
                height={48}
                alt="milkdown logo"
                className="h-12 w-12"
                src="/milkdown-logo.svg"
              />
            </Link>
          </div>
          <LinkGroups {...communityGroup} />
          <LinkGroups {...linksGroup} />
          <LinkGroups {...moreGroup} />
        </div>
        <div className="flex flex-col items-baseline justify-between gap-2 md:flex-row">
          <div className="mt-6 text-sm font-light text-nord2 dark:text-nord4">
            MIT Licensed | Copyright © 2021-present Mirone ♡ Meo
          </div>
          <a href="https://vercel.com/?utm_source=milkdown&utm_campaign=oss">
            <Image src={vercelBanner} alt="vercel banner" className="w-32" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
