import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

import { Discord, Github, Twitter } from "@/components/svg-icon";

import vercelBanner from "./vercel-banner.svg";

type LinkGroupsProps = {
  title: string;
  items: Array<{ text: string; link: string }>;
};

const LinkGroups: FC<LinkGroupsProps> = ({ title, items }) => {
  return (
    <div className="flex-1">
      <div className="mb-4 text-lg font-semibold md:text-xl">{title}</div>
      {items.map((item, i) => (
        <div
          key={i.toString()}
          className={clsx(
            "mb-2 text-sm md:text-base",
            "text-nord-neutral/[.80] dark:text-nord-neutral-dark/[.80]",
            "hover:text-nord-neutral dark:hover:text-nord-neutral-dark",
          )}
        >
          <a href={item.link}>{item.text}</a>
        </div>
      ))}
    </div>
  );
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
    <footer
      className={clsx(
        "w-full self-end bg-gray-200 dark:bg-gray-700",
        "pt-6 pb-12 md:pt-16 md:pb-16",
      )}
    >
      <div className="mx-8 md:mx-24 lg:mx-40 xl:mx-80 2xl:mx-auto 2xl:max-w-4xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex-1/2">
            <div className="text-lg font-semibold md:text-xl">Community</div>
            <div className="mt-4 flex items-center gap-6">
              <a
                className="fill-nord-solid/80 hover:fill-nord-solid dark:fill-nord-solid-dark/80 dark:hover:fill-nord-solid-dark"
                href="https://github.com/Milkdown/milkdown"
                target="_blank"
                rel="noreferrer"
              >
                <Github />
              </a>
              <a
                className="fill-nord-solid/80 hover:fill-nord-solid dark:fill-nord-solid-dark/80 dark:hover:fill-nord-solid-dark"
                href="https://discord.gg/SdMnrSMyBX"
                target="_blank"
                rel="noreferrer"
              >
                <Discord />
              </a>
              <a
                className="fill-nord-solid/80 hover:fill-nord-solid dark:fill-nord-solid-dark/80 dark:hover:fill-nord-solid-dark"
                href="https://twitter.com/mirone_saul"
                target="_blank"
                rel="noreferrer"
              >
                <Twitter />
              </a>
            </div>
          </div>
          <div className="flex-1/2 flex">
            <LinkGroups {...linksGroup} />
            <LinkGroups {...moreGroup} />
          </div>
          <div className="flex-1/2 flex items-center gap-5">
            <Link className="flex items-center gap-3" href={root}>
              <Image
                width={40}
                height={40}
                alt="milkdown logo"
                className="h-12 w-12"
                src="/milkdown-logo.svg"
              />
              <span className="text-lg font-bold md:text-xl">Milkdown</span>
            </Link>

            <a
              className="block"
              href="https://vercel.com/?utm_source=milkdown&utm_campaign=oss"
            >
              <Image src={vercelBanner} alt="vercel banner" className="w-24" />
            </a>
          </div>
          <div className="flex-1/2">
            <div
              className={clsx(
                "font-light",
                "text-nord-neutral-deep/40 dark:text-nord-neutral-deep-dark/40",
                "text-xs md:text-sm lg:text-base",
                "!leading-[48px]",
              )}
            >
              MIT Licensed | Copyright © 2021-present Mirone ♡ Meo
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
