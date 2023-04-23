import { MilkdownPlugin } from "@milkdown/ctx";
import { slashFactory } from "@milkdown/plugin-slash";

export const emojiSlash = slashFactory("emojiMenu") satisfies MilkdownPlugin[];
