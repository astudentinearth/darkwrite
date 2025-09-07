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

export function ThemeDropdown(props: {
  className?: string;
  value: string;
  onValueChange: (value: string) => void;
}) {
  const themes = useThemes().data;
  const entries = Object.values(themes);
  return (
    <Select value={props.value} onValueChange={props.onValueChange}>
      <SelectTrigger className={cn(props.className, "max-w-fit")}>
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
  const mutation = useUpdateSettings();
  const setScheme = (mode: "dark" | "light", id: string) => {
    const updated = produce(settings, (draft) => {
      draft.appearance[
        mode === "dark" ? "darkColorScheme" : "lightColorScheme"
      ] = id;
    });
    mutation.mutate(updated);
  };

  return (
    <div className="flex flex-col bg-view-2 rounded-lg p-4 w-160 gap-4">
      <div className="flex justify-between items-center">
        <span className="font-medium">Light color theme</span>
        <ThemeDropdown
          value={lightTheme}
          onValueChange={(val) => setScheme("light", val)}
        />
      </div>
      <hr />
      <div className="flex justify-between items-center">
        <span className="font-medium">Dark color theme</span>
        <ThemeDropdown
          value={darkTheme}
          onValueChange={(val) => setScheme("dark", val)}
        />
      </div>
    </div>
  );
}
