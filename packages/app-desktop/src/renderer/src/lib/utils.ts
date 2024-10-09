import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fromUnicode(unicode: string) {
  if (unicode == null) return "";
  const points = unicode.split("-").map((p) => parseInt(p, 16));
  return String.fromCodePoint(...points.filter((p) => !isNaN(p)));
}
