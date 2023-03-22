import { useHideSidePanel, useSidePanelVisible } from "@/providers";
import { DesktopNav } from "./Desktop";
import { MobileNav } from "./Mobile";
import { SidePanel } from "./SidePanel";

const Nav = () => {
  const sidePanelVisible = useSidePanelVisible();
  const hideSidePanel = useHideSidePanel();
  return (
    <>
      <div className="fixed inset-y-0 left-0 z-40 hidden w-20 bg-nord6/70 backdrop-blur backdrop-saturate-50 dark:bg-nord3/70 md:block">
        <DesktopNav />
      </div>
      <div className="fixed inset-x-0 top-0 z-40 block h-16 bg-nord6/70 backdrop-blur backdrop-saturate-50 dark:bg-nord3/70 md:hidden">
        <MobileNav />
      </div>
      <div
        className={`fixed inset-y-0 z-30 w-80 rounded-r-3xl
            bg-nord6/90
            py-16 shadow-lg
            backdrop-blur backdrop-saturate-50 transition-all
            duration-200 ease-in-out
            dark:bg-nord3/80 md:py-0 ${
              sidePanelVisible ? "left-0 md:left-20" : "-left-80"
            }`}
      >
        <SidePanel />
      </div>

      <div
        onClick={() => hideSidePanel(0)}
        className={`fixed inset-0 z-10 bg-nord0/50 backdrop-blur backdrop-saturate-50 ${
          sidePanelVisible ? "block md:hidden" : "hidden"
        }`}
      />
    </>
  );
};

export default Nav;
