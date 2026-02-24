import { DarkwriteAPIClient } from "@/api/api-client";
import { Button, Label, Switch } from "@/components/ui";
import { ColorPicker } from "@/components/ui/color-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Folder } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppearanceSettings } from "./store/settings-selectors";
import { updateAccentColor, updateSettings } from "./store/settings-actions";
import { useThemes } from "../themes/hooks/use-themes";
import { initializeThemes } from "../themes/init";

export function ThemeDropdown(props: {
  className?: string;
  value: string;
  onValueChange: (value: string) => void;
}) {
  const themes = useThemes();
  const entries = Object.values(themes);
  return (
    <Select value={props.value} onValueChange={props.onValueChange}>
      <SelectTrigger className={cn(props.className, "max-w-fit bg-view-1/50")}>
        {themes[props.value].name}
      </SelectTrigger>
      <SelectContent>
        {entries.map((e) => (
          <SelectItem value={e.id}>{e.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function ThemeChooser() {
  const settings = useAppearanceSettings();
  const lightTheme = settings.lightColorScheme;
  const darkTheme = settings.darkColorScheme;
  const accentColor = settings.accentColor;
  const qc = useQueryClient();
  const useSystemAccentColor = settings.useSystemAccentColor;
  const { t } = useTranslation("translation");
  const importTheme = async () => {
    await DarkwriteAPIClient.theme.importTheme();
    initializeThemes();
  };

  const setScheme = (mode: "dark" | "light", id: string) => {
    updateSettings({
      appearance: {
        [mode === "dark" ? "darkColorScheme" : "lightColorScheme"]: id,
      },
    });
  };

  const toggleSystemAccentColor = (value: boolean) => {
    updateSettings({ appearance: { useSystemAccentColor: value } });
  };

  return (
    <>
      <div className="flex w-160 gap-2">
        <Button
          className="w-fit bg-view-2"
          variant={"outline"}
          onClick={importTheme}
        >
          <Folder size={18} />
          {t("settings.appearance.importTooltip")}
        </Button>
      </div>
      <div className="flex flex-col bg-view-2 rounded-lg p-4 w-160 gap-4 drop-shadow-sm">
        <div className="flex justify-between items-center">
          <span className="font-medium">
            {t("settings.appearance.lightColorScheme")}
          </span>
          <div className="flex gap-2">
            <ThemeDropdown
              value={lightTheme}
              onValueChange={(val) => setScheme("light", val)}
            />
          </div>
        </div>
        <hr />
        <div className="flex justify-between items-center">
          <span className="font-medium">
            {t("settings.appearance.darkColorScheme")}
          </span>
          <div className="flex gap-2">
            <ThemeDropdown
              value={darkTheme}
              onValueChange={(val) => setScheme("dark", val)}
            />
          </div>
        </div>
        <hr />
        <div
          className={cn(
            "flex justify-between items-center",
            useSystemAccentColor && "opacity-60",
          )}
        >
          <span className="font-medium">
            {t("settings.appearance.accentColorText")}
          </span>
          <ColorPicker
            disabled={useSystemAccentColor}
            value={accentColor}
            onChange={updateAccentColor}
          />
        </div>
        <hr />
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <Label htmlFor="switch-use-system-accent-color">
              {t("settings.appearance.useSystemAccentColor")}{" "}
            </Label>
            <p className="text-sm opacity-80">
              {t("settings.appearance.useSystemAccentColorDescription")}
            </p>
          </div>
          <Switch
            checked={useSystemAccentColor}
            onCheckedChange={toggleSystemAccentColor}
            id="switch-use-system-accent-color"
          />
        </div>
      </div>
    </>
  );
}
