import { formatDate } from "@/utils/date";

export type BlogConfigItem = {
  id: string;

  author: string[];

  desc: string;

  date: string;
};

const getDate = (year: number, month: number, day: number) => {
  return formatDate(new Date(Date.UTC(year, month - 1, day)));
};

/// Put the latest blogs on the top please.
export const blogConfig: BlogConfigItem[] = [
  {
    id: "understanding-headless-slash-plugin",
    author: ["Mirone"],
    desc: "Why we built slash plugin as a headless plugin?",
    date: getDate(2023, 4, 25),
  },
  {
    id: "announcing-telemetry-inspector",
    author: ["Mirone"],
    desc: "Get editor inner information and status during runtime.",
    date: getDate(2023, 4, 9),
  },
  {
    id: "build-your-own-milkdown-copilot",
    author: ["Mirone"],
    desc: "Use AI to power your writing experience. What if you can build your own copilot?",
    date: getDate(2023, 3, 30),
  },
  {
    id: "introducing-milkdown@7",
    author: ["Mirone"],
    desc: "A brand new version of milkdown is coming. Let's take a look at what's new.",
    date: getDate(2023, 2, 22),
  },
];
