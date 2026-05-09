import { ok, err } from "neverthrow";

export function errOnUndefined<E>(error: E) {
  return <T>(predicate: T | undefined) =>
    predicate !== undefined ? ok(predicate) : err<T, E>(error);
}

export function firstOrErr<E>(error: E) {
  return <T>(arr: T[]) => (arr.at(0) ? ok(arr[0]) : err<T, E>(error));
}

export function okVoid() {
  return ok();
}
