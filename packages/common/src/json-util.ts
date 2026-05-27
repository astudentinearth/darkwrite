/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Optional } from "@/ts-util";
import _ from "lodash";
import { err, ok, type Result } from "neverthrow";

export type JsonParseError = { type: "invalid-json-string"; message?: string };

/** @deprecated */
export function tryParse(str: string): Optional<Record<string, any>> {
  const result = _.attempt(() => JSON.parse(str));
  if (result instanceof Error) return { error: result };
  else return { result: result as Record<string, any> };
}

export function parseJson<T>(str: string): Result<T, JsonParseError> {
  try {
    return ok(JSON.parse(str) as T);
  } catch (e) {
    if (!(e instanceof Error)) return err({ type: "invalid-json-string" });
    return err({ type: "invalid-json-string", message: e.message });
  }
}

const JSONUtil = {
  tryParse,
  parseJson,
};

export default JSONUtil;
