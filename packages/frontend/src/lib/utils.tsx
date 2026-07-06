import { NoteType } from "@darkwrite/common";
import { type ClassValue, clsx } from "clsx";
import { hex } from "color-convert";
import {
  FileText,
  type LucideIcon,
  Table2,
  TableProperties,
} from "lucide-react";
import { nanoid } from "nanoid";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fromUnicode(unicode: string) {
  if (unicode == null) return "";
  const points = unicode.split("-").map((p) => parseInt(p, 16));
  return String.fromCodePoint(...points.filter((p) => !Number.isNaN(p)));
}

export const noteTypeToIcon: Record<NoteType, LucideIcon> = {
  [NoteType.Doc]: FileText,
  [NoteType.Database]: TableProperties,
  [NoteType.DatabaseView]: Table2,
};

/** @deprecated use `getNoteIcon2` instead. */
export function getNoteIcon(icon?: string | null, className?: string) {
  if (!icon) {
    return <FileText size={18} className={className} />;
  }
  return fromUnicode(icon);
}

export function getNoteIcon2(
  icon: string | null,
  type: NoteType,
  className?: string,
) {
  if (!icon) {
    const Icon = noteTypeToIcon[type];
    return <Icon size={18} className={className} />;
  }
  return fromUnicode(icon);
}

export function setGlobalStyle(property: string, value: string) {
  document.documentElement.style.setProperty(property, value);
}

export function hexToHslVariable(hexstr: string) {
  const sanitized = hexstr.trim().replace("#", "");
  const hsl = hex.hsl(sanitized);
  return `${hsl[0]} ${hsl[1]}% ${hsl[2]}%`;
}

export function generateId() {
  if (self.crypto != null && typeof self.crypto.randomUUID === "function")
    return self.crypto.randomUUID();
  else return nanoid();
}

export function isClamped<T extends number | bigint>(
  val: T,
  min: T,
  max: T,
): boolean {
  return val > min && val < max;
}
