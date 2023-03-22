import { compose } from "@/utils/compose";

import { DarkModeProvider } from "./DarkModeProvider";
import { SidePanelStateProvider } from "./SidePanelStateProvider";

export const LayoutProvider = compose(DarkModeProvider, SidePanelStateProvider);

export * from "./DarkModeProvider";
export * from "./SidePanelStateProvider";
