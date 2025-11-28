import { DEFAULT_THEME_LIST, DEFAULT_THEMES } from "@/common/themes";
import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Switch,
} from "@/components/ui";
import { useTranslation } from "react-i18next";
import { ForwardButton } from "./onboarding-button";
import { setOnboardingTheme, useOnboardingState } from "./onboarding-state";

export default function ThemeSelection() {
  const { t } = useTranslation();
  const theme = useOnboardingState((s) => s.theme);
  const updateCheck = useOnboardingState((s) => s.enableUpdateCheck);
  const goToPage = useOnboardingState((s) => s.goToPage);
  const _continue = () => {
    goToPage("finish");
  };
  return (
    <div className="flex flex-col items-center">
      <img src="darkwrite_icon.png" className="w-30 h-30 drop-shadow-xl"></img>
      <div className="h-5" />
      <div className="text-center text-[32px} font-semibold">
        {t("onboarding.themeTitle")}
      </div>
      <div className="h-4"></div>
      <div className="text-xl text-center max-w-100">
        {t("onboarding.themeDesc")}
      </div>
      <div className="h-6"></div>
      <div className="flex gap-3">
        <Select value={theme} onValueChange={(val) => setOnboardingTheme(val)}>
          <SelectTrigger className="rounded-2xl text-xl! h-14 w-75 bg-view-2 pl-5 pr-4">
            {DEFAULT_THEMES[theme].name}
          </SelectTrigger>
          <SelectContent className="rounded-2xl z-50 no-window-drag">
            {DEFAULT_THEME_LIST.filter((t) => t.mode === "dark").map(
              (theme) => (
                <SelectItem
                  className="rounded-xl py-2 text-xl no-window-drag"
                  value={theme.id}
                >
                  {theme.name}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
        <ForwardButton onClick={_continue} />
      </div>
      <div className="h-8"></div>
      <div className="flex gap-3 items-center">
        <Switch
          id="updatecheckenabled"
          checked={updateCheck}
          onCheckedChange={(value) =>
            useOnboardingState.setState({ enableUpdateCheck: value })
          }
        />
        <Label className="text-lg" htmlFor="updatecheckenabled">
          {t("onboarding.checkForUpdates")}
        </Label>
      </div>
    </div>
  );
}
