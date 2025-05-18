import { FC } from "react";

import {
  apiConfigByCategory,
  guideConfig,
  pluginConfig,
  recipesConfig,
} from "@/routes";

import { SystemButtonGroup } from "../shared/SystemButtonGroup";
import { Dropdown } from "./Dropdown";
import { DropdownWithLabel } from "./DropdownWithLabel";
import { TextButton, TextLinkButton } from "./TextButton";

export const DesktopNav: FC = () => {
  return (
    <div className="divide-nord-neutral/10 dark:divide-nord-neutral-dark/10 hidden divide-x md:flex">
      <div className="flex gap-2 pr-2 lg:gap-6 lg:pr-6">
        <TextButton text="Guide">
          <Dropdown {...guideConfig} />
        </TextButton>
        <TextButton text="Recipes">
          <Dropdown {...recipesConfig} />
        </TextButton>
        <TextButton text="Plugin">
          <Dropdown {...pluginConfig} />
        </TextButton>
        <TextButton text="API">
          <DropdownWithLabel scope="api" items={apiConfigByCategory} />
        </TextButton>
        <TextLinkButton text="Blog" link="/blog" />
        <TextLinkButton text="Playground" link="/playground" />
      </div>
      <SystemButtonGroup />
    </div>
  );
};
