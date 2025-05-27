import { nanoid } from "nanoid";

export function generateId(length: number = 12) {
  return nanoid(length);
}
