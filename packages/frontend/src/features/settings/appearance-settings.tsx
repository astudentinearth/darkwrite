import FontSettings from "./font-settings";
import { ThemeChooser } from "./theme-chooser";
import ThemeModeToggle from "./theme-mode-toggle";
import { UIOptions } from "./ui-options";
import { WindowFrameSettings } from "./window-frame";

export default function AppearanceSettings() {
  return (
    <div className="w-full flex flex-col items-center pt-3 gap-4">
      <ThemeModeToggle />
      <ThemeChooser />
      <UIOptions />
      <FontSettings />
      <WindowFrameSettings />
    </div>
  );
}
