import { useLinkClass } from "@/hooks";
import { useDarkMode } from "@/providers";

import * as Accordion from "@radix-ui/react-accordion";
import clsx from "clsx";
import type { FC, RefObject } from "react";
import { JSONTree } from "react-json-tree";
import pkgJson from "../../../../package.json";
import type { CodemirrorProps, CodemirrorRef } from "../../codemirror";
import { Codemirror } from "../../codemirror";
import { useProseState } from "../../playground-editor/ProseStateProvider";
import { PluginToggle } from "../plugin-toggle";
import { useShare } from "../../playground-editor/ShareProvider";
import { AccordionItem } from "./AccordionItem";

interface ControlPanelProps extends CodemirrorProps {
  codemirrorRef: RefObject<CodemirrorRef>;
}

const twilight = {
  scheme: "twilight",
  base00: "#2E3440",
  base01: "#323537",
  base02: "#464b50",
  base03: "#5f5a60",
  base04: "#838184",
  base05: "#a7a7a7",
  base06: "#c3c3c3",
  base07: "#ffffff",
  base08: "#cf6a4c",
  base09: "#cda869",
  base0A: "#f9ee98",
  base0B: "#8f9d6a",
  base0C: "#afc4db",
  base0D: "#7587a6",
  base0E: "#9b859d",
  base0F: "#9b703f",
};

export const ControlPanel: FC<ControlPanelProps> = ({
  content,
  onChange,
  lock,
  codemirrorRef,
}) => {
  const linkClass = useLinkClass();
  const proseState = useProseState();
  const darkMode = useDarkMode();
  const share = useShare();

  return (
    <div className="h-full">
      <div className="flex h-10 items-center justify-between border-b border-nord4 bg-gray-200 px-4 py-2 font-light dark:border-gray-600 dark:bg-gray-700">
        <div>
          <span>Milkdown Playground</span>
          <span className="ml-2 font-mono text-xs text-gray-600 dark:text-gray-300">
            v{pkgJson.dependencies["@milkdown/core"]}
          </span>
        </div>
        <div>
          <button
            onClick={() => share()}
            className={clsx(
              linkClass(false),
              "flex h-8 w-8 items-center justify-center rounded-full"
            )}
          >
            <span className="material-symbols-outlined !text-base">share</span>
          </button>
        </div>
      </div>
      <Accordion.Root
        type="single"
        defaultValue="markdown"
        className="h-[calc(100%-2.5rem)]"
      >
        <AccordionItem value="markdown" name="Markdown">
          <Codemirror
            ref={codemirrorRef}
            content={content}
            onChange={onChange}
            lock={lock}
          />
        </AccordionItem>
        <AccordionItem value="inspector" name="Inspector">
          <PluginToggle />
        </AccordionItem>
        <AccordionItem value="state" name="State">
          <div className="flex min-h-full px-2 [&>*]:!m-0 [&>*]:flex-1 [&>*]:!bg-transparent">
            <JSONTree
              data={proseState}
              theme={twilight}
              invertTheme={!darkMode}
            />
          </div>
        </AccordionItem>
      </Accordion.Root>
    </div>
  );
};
