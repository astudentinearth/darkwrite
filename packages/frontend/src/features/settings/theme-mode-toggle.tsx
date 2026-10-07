import type { ThemeMode } from "@darkwrite/common";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppearanceSettings } from "./hooks/use-settings";
import { useSettingsActions } from "./store/settings-actions";

export default function ThemeModeToggle() {
  const { updateSettings } = useSettingsActions();
  const settings = useAppearanceSettings();
  const themeMode = settings.themeMode;
  const activeClassname =
    "bg-primary! text-primary-foreground hover:hover-primary";
  const { t } = useTranslation();
  const setMode = (mode: ThemeMode) => {
    if (mode === themeMode) return;
    updateSettings({ appearance: { themeMode: mode } });
  };
  return (
    <div className="flex gap-2 [&>div]:flex [&>div]:flex-row [&>div]:justify-center [&_button]:w-24 [&_button]:h-24 [&_button]:p-4 [&_button]:flex-col">
      <div>
        <Button
          onClick={() => setMode("light")}
          variant={"secondary"}
          className={cn(
            themeMode === "light" && activeClassname,
            "rounded-r-none rounded-l-xl",
          )}
        >
          <Sun size={24} />
          {t("settings.appearance.lightMode")}
        </Button>
        <div className="h-full w-px bg-border" />
        <Button
          onClick={() => setMode("system")}
          variant={"secondary"}
          className={cn(
            themeMode === "system" && activeClassname,
            "rounded-none",
          )}
        >
          <Monitor size={24} />
          {t("settings.appearance.systemMode")}
        </Button>
        <div className="h-full w-px bg-border" />
        <Button
          onClick={() => setMode("dark")}
          variant={"secondary"}
          className={cn(
            themeMode === "dark" && activeClassname,
            "rounded-l-none rounded-r-xl",
          )}
        >
          <Moon size={24} />
          {t("settings.appearance.darkMode")}
        </Button>
      </div>
    </div>
  );
}
