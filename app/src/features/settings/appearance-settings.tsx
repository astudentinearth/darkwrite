import { ThemeChooser } from "./theme-chooser";
import ThemeModeToggle from "./theme-mode-toggle";

export default function AppearanceSettings(){
  return <div className="w-full flex flex-col items-center pt-3 gap-4">
    <ThemeModeToggle/>
    <ThemeChooser />
  </div>
}