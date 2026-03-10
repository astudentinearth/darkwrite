import { showAppMenu } from "@/api/appmenu";
import { OS } from "@darkwrite/common";
import { HeaderbarButton } from "@/components/headerbar-button";
import { InitialUserSettings } from "@/init";
import { getOperatingSystem } from "@/lib/platform";

function shouldShow() {
  if (InitialUserSettings.settings.appearance.useSystemWindowFrame) return true;
  if (getOperatingSystem() !== OS.MACOS) return true;
  return false;
}

export default function AppMenu() {
  if (!shouldShow()) {
    return <></>;
  }
  return (
    <HeaderbarButton
      onClick={() => {
        showAppMenu();
      }}
      data-testid="button-darkwrite"
      className="opacity-90"
      title="Menu"
    >
      <img src="darkwrite_icon.png" className="shrink-0 w-5 h-5"></img>
    </HeaderbarButton>
  );
}
