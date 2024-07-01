import {
  apiConfigByCategory,
  guideConfig,
  pluginConfig,
  recipesConfig,
} from "@/routes";
import { FC } from "react";
import { TextButton, TextLinkButton } from "./TextButton";
import { Dropdown } from "./Dropdown";
import { DropdownWithLabel } from "./DropdownWithLabel";
import { SystemButtonGroup } from "../shared/SystemButtonGroup";

export const DesktopNav: FC = () => {
  return (
    <div className="hidden divide-x divide-nord-neutral divide-opacity-10 dark:divide-nord-neutral-dark dark:divide-opacity-10 md:flex">
      <div className="mr-2 flex gap-2 lg:mr-6 lg:gap-6">
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
