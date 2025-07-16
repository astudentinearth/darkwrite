import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@darkwrite/ui";
import {
  updateUserSettings,
  useSettingsStore,
} from "@/context/settings-store";
import { useTheme } from "@/hooks/query";
import { cn } from "@/lib/utils";
import { produce } from "immer";

export function ThemeMenu() {
  const themeId = useSettingsStore((s) => s.settings.appearance.theme);
  const { themes } = useTheme();
  const theme = themes.find((n) => n.id === themeId);
  const setTheme = (id: string) =>
    updateUserSettings((old) =>
      produce(old, (draft) => {
        draft.appearance.theme = id;
      }),
    );
  return (
    <Select value={themeId} onValueChange={(val) => setTheme(val)}>
      <SelectTrigger className="bg-secondary h-10">{theme?.name ?? "Choose theme"}</SelectTrigger>
      <SelectContent className="max-h-[60vh] overflow-y-auto main-view">
        {themes.map((theme) => (
          <SelectItem
            onSelect={() => setTheme(theme.id)}
            key={theme.id}
            value={theme.id}
            className={cn(
              "rounded-md",
              theme.id === themeId && "bg-secondary/50",
            )}
          >
            {theme.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
