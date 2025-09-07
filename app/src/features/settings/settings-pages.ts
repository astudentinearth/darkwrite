import { Briefcase, FlaskConical, Info, Keyboard, SwatchBook } from "lucide-react";

export const SETTINGS_PAGES = {
  "workspace": "Workspace",
  "appearance": "Apperanace",
  "shortcuts": "Shortcuts",
  "experimental": "Experiments",
  "about": "About"
}

export type SETTINGS_PAGE = keyof typeof SETTINGS_PAGES;

export const TAB_ICONS = {
  "workspace": Briefcase,
  "appearance": SwatchBook,
  "shortcuts": Keyboard,
  "experimental": FlaskConical,
  "about": Info
}
