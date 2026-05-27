import { OS } from "@darkwrite/common";
import { useTranslation } from "react-i18next";
import { showAppMenu } from "@/api/appmenu";
import { HeaderbarButton } from "@/components/headerbar-button";
import { TextTooltip } from "@/components/ui/tooltip";
import { InitialUserSettings } from "@/init";
import { getOperatingSystem } from "@/lib/platform";

function shouldShow() {
  if (InitialUserSettings.settings.appearance.useSystemWindowFrame) return true;
  if (getOperatingSystem() !== OS.MACOS) return true;
  return false;
}

export default function AppMenu() {
  const { t } = useTranslation();
  if (!shouldShow()) {
    return <></>;
  }
  return (
    <TextTooltip text={t("sidebar.button.menu")}>
      <HeaderbarButton
        onClick={() => {
          showAppMenu();
        }}
        data-testid="button-darkwrite"
        className="opacity-90"
        aria-label={t("sidebar.button.menu")}
      >
        <img src="darkwrite_icon.png" className="shrink-0 w-5 h-5"></img>
      </HeaderbarButton>
    </TextTooltip>
  );
}
