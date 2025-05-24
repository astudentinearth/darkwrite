import { type ClassValue, clsx } from "clsx";
import { FileText } from "lucide-react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fromUnicode(unicode: string) {
  if (unicode == null) return "";
  const points = unicode.split("-").map((p) => parseInt(p, 16));
  return String.fromCodePoint(...points.filter((p) => !isNaN(p)));
}

export function getNoteIcon(icon?: string, className?: string) {
  if (!icon) return <FileText size={18} className={className} />;
  return fromUnicode(icon);
}