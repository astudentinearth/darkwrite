import { OS } from "@darkwrite/common";
import { useLocalStore } from "@/context/local-state";
import { InitialUserSettings } from "@/init";
import { getOperatingSystem } from "@/lib/platform";
import { useLayoutStore } from "./layout-store";

export default function TrafficLightsPlaceholder() {
  const fullscreen = useLayoutStore((state) => state.isFullscreen);
  const isSidebarCollapsed = useLocalStore((s) => s.isSidebarCollapsed);
  if (
    window.isElectron &&
    !fullscreen &&
    getOperatingSystem() === OS.MACOS &&
    !InitialUserSettings.settings.appearance.useSystemWindowFrame &&
    isSidebarCollapsed
  ) {
    return <div className="w-18"></div>;
  } else return <></>;
}
