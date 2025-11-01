import { ThemeMode } from "@/common/settings";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSettings, useUpdateSettings } from "@/query/use-settings";
import { produce } from "immer";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ThemeModeToggle() {
  const settings = useSettings().data;
  const themeMode = settings.appearance.themeMode;
  const activeClassname =
    "text-primary-text bg-secondary/40! hover:text-primary-text";
  const mutation = useUpdateSettings();
  const { t } = useTranslation();
  const setMode = (mode: ThemeMode) => {
    if (mode === themeMode) return;
    const updated = produce(settings, (draft) => {
      draft.appearance.themeMode = mode;
    });
    mutation.mutate(updated);
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
