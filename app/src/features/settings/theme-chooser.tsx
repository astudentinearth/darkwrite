import { Label, Switch } from "@/components/ui";
import { ColorPicker } from "@/components/ui/color-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useSettings, useUpdateSettings } from "@/query/use-settings";
import { useThemes } from "@/query/use-themes";
import { produce } from "immer";
import { useTranslation } from "react-i18next";

export function ThemeDropdown(props: {
  className?: string;
  value: string;
  onValueChange: (value: string) => void;
}) {
  const themes = useThemes().data;
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
  const settings = useSettings().data;
  const lightTheme = settings.appearance.lightColorScheme;
  const darkTheme = settings.appearance.darkColorScheme;
  const accentColor = settings.appearance.accentColor;
  const useSystemAccentColor = settings.appearance.useSystemAccentColor;
  const { t } = useTranslation("translation");
  const mutation = useUpdateSettings();
  const setScheme = (mode: "dark" | "light", id: string) => {
    const updated = produce(settings, (draft) => {
      draft.appearance[
        mode === "dark" ? "darkColorScheme" : "lightColorScheme"
      ] = id;
    });
    mutation.mutate(updated);
  };
  const toggleSystemAccentColor = (value: boolean) => {
    const updated = produce(settings, (draft) => {
      draft.appearance.useSystemAccentColor = value;
    });
    mutation.mutate(updated);
  };
  return (
    <div className="flex flex-col bg-view-2 rounded-lg p-4 w-160 gap-4 drop-shadow-sm">
      <div className="flex justify-between items-center">
        <span className="font-medium">
          {t("settings.appearance.lightColorScheme")}
        </span>
        <ThemeDropdown
          value={lightTheme}
          onValueChange={(val) => setScheme("light", val)}
        />
      </div>
      <hr />
      <div className="flex justify-between items-center">
        <span className="font-medium">
          {t("settings.appearance.darkColorScheme")}
        </span>
        <ThemeDropdown
          value={darkTheme}
          onValueChange={(val) => setScheme("dark", val)}
        />
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
          onChange={mutation.updateAccentColor}
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
  );
}
