import {
  Briefcase,
  FlaskConical,
  Info,
  Keyboard,
  SwatchBook,
} from "lucide-react";
import AppearanceSettings from "./appearance-settings";
import WorkspaceSettings from "./workspace-settings";

export const TAB_TITLES = {
  workspace: "settings.workspace.title",
  appearance: "settings.appearance.title",
  //"shortcuts": "Shortcuts",
  //"experimental": "Experiments",
  about: "settings.about.title",
};

export type SETTINGS_PAGE = keyof typeof TAB_TITLES;

export const TAB_ICONS = {
  workspace: Briefcase,
  appearance: SwatchBook,
  shortcuts: Keyboard,
  experimental: FlaskConical,
  about: Info,
};

export const SETTINGS_PAGES = {
  workspace: WorkspaceSettings,
  appearance: AppearanceSettings,
  // shortcuts: "Shortcuts",
  // experimental: "Experiments",
  about: "About",
};
