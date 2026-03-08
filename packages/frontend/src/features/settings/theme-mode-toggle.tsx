import { ThemeMode } from "@darkwrite/common"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppearanceSettings } from "./hooks/use-settings";
import { useSettingsActions } from "./store/settings-actions";

export default function ThemeModeToggle() {
  const { updateSettings } = useSettingsActions();
  const settings = useAppearanceSettings();
  const themeMode = settings.themeMode;
  const activeClassname =
    "text-primary-text bg-secondary/40! hover:text-primary-text";
  const { t } = useTranslation();
  const setMode = (mode: ThemeMode) => {
    if (mode === themeMode) return;
    updateSettings({ appearance: { themeMode: mode } });
  };
  return (
    <div className="flex gap-2 [&>div]:flex [&>div]:flex-row [&>div]:justify-center [&_button]:w-24 [&_button]:h-24 [&_button]:p-4 [&_button]:flex-col [&_button]:bg-transparent">
      <div className="gap-2">
        <Button
          onClick={() => setMode("light")}
          variant={"outline"}
          className={cn(themeMode === "light" && activeClassname)}
        >
          <Sun size={24} />
          {t("settings.appearance.lightMode")}
        </Button>
        <Button
          onClick={() => setMode("system")}
          variant={"outline"}
          className={cn(themeMode === "system" && activeClassname)}
        >
          <Monitor size={24} />
          {t("settings.appearance.systemMode")}
        </Button>
        <Button
          onClick={() => setMode("dark")}
          variant={"outline"}
          className={cn(themeMode === "dark" && activeClassname)}
        >
          <Moon size={24} />
          {t("settings.appearance.darkMode")}
        </Button>
      </div>
    </div>
  );
}
