import { err, ok, type Result } from "neverthrow";

export type JsonParseError = { type: "invalid-json-string"; message?: string };

export function parseJson<T>(str: string): Result<T, JsonParseError> {
  try {
    return ok(JSON.parse(str) as T);
  } catch (e) {
    if (!(e instanceof Error)) return err({ type: "invalid-json-string" });
    return err({ type: "invalid-json-string", message: e.message });
  }
}

