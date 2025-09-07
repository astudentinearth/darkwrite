import { Briefcase, FlaskConical, Info, Keyboard, SwatchBook } from "lucide-react";
import AppearanceSettings from "./appearance-settings";

export const TAB_TITLES = {
  "workspace": "Workspace",
  "appearance": "Appearanace",
  "shortcuts": "Shortcuts",
  "experimental": "Experiments",
  "about": "About"
}

export type SETTINGS_PAGE = keyof typeof TAB_TITLES;

export const TAB_ICONS = {
  "workspace": Briefcase,
  "appearance": SwatchBook,
  "shortcuts": Keyboard,
  "experimental": FlaskConical,
  "about": Info
}

export const SETTINGS_PAGES = {
  "workspace": "Workspace",
  "appearance": AppearanceSettings,
  "shortcuts": "Shortcuts",
  "experimental": "Experiments",
  "about": "About"
} 
