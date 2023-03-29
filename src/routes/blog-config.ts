import { formatDate } from "@/utils/date";

export type BlogConfigItem = {
  id: string;

  desc: string;

  date: string;
};

const getDate = (year: number, month: number, day: number) => {
  return formatDate(new Date(Date.UTC(year, month - 1, day)));
};

/// Put the latest blogs on the top please.
export const blogConfig: BlogConfigItem[] = [
  {
    id: "introducing-milkdown@7",
    desc: "A brand new version of milkdown is coming. Let's take a look at what's new.",
    date: getDate(2023, 2, 22),
  },
];
