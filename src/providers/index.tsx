import { ToastProvider } from "@/components/toast";
import { compose } from "@/utils/compose";

import { DarkModeProvider } from "./DarkModeProvider";
import { SidePanelStateProvider } from "./SidePanelStateProvider";

export const LayoutProvider = compose(
  DarkModeProvider,
  SidePanelStateProvider,
  ToastProvider,
);

export * from "./DarkModeProvider";
export * from "./SidePanelStateProvider";
export * from "./DocSearchProvider";
