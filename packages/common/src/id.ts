import { nanoid } from "nanoid";

export function generateId() {
  if (self.crypto != null && typeof self.crypto.randomUUID === "function")
    return self.crypto.randomUUID();
  else return nanoid();
}
