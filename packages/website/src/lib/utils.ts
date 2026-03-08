import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type ClassProp = { class?: string };

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
