import { err, errAsync, ok, Result, ResultAsync } from "neverthrow";
import z from "zod";

export interface DwError {
  message: string;
  cause?: string;
}

export const buildDwError = (message: string, cause?: string) =>
  ({ message, cause }) satisfies DwError;

export const dwErr = <T = never>(message: string, cause?: string) =>
  err<T, DwError>(buildDwError(message, cause));
export const dwErrAsync = <T = never>(message: string, cause?: string) =>
  errAsync<T, DwError>(buildDwError(message, cause));

export type DwResult<T> = Result<T, DwError>;
export type DwResultAsync<T> = ResultAsync<T, DwError>;

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

export type SerializedResult<T, E> =
  | {
      isOk: true;
      value: T;
    }
  | { isOk: false; error: E };

export function serializeResult<T, E>(
  result: Result<T, E>,
): SerializedResult<T, E> {
  return result.isOk()
    ? { isOk: true, value: result.value }
    : { isOk: false, error: result.error };
}

export async function serializeResultAsync<T, E>(
  resultAsync: ResultAsync<T, E>,
): Promise<SerializedResult<T, E>> {
  return serializeResult(await resultAsync);
}

export function hydrateResult<T, E>(
  serialized: SerializedResult<T, E>,
): Result<T, E> {
  return serialized.isOk
    ? ok<T, E>(serialized.value)
    : err<T, E>(serialized.error);
}

export function hydrateResultAsync<T, E>(
  serialized: Promise<SerializedResult<T, E>>,
): ResultAsync<T, E> {
  const r = ResultAsync.fromPromise(
    (async () => {
      const result = await serialized;
      if (result.isOk) return result.value;
      else throw result.error;
    })(),
    (e) => e as E,
  );
  return r;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtractResultTypes<F extends (...args: any[]) => any> =
  Awaited<ReturnType<F>> extends Result<infer T, infer E> ? [T, E] : never;

export function validateSchema<T extends z.ZodType>(schema: T) {
  return (data: unknown) => {
    const result = schema.safeParse(data);
    if (result.success) return ok(result.data);
    else
      return dwErr(
        "Schema validation failed.",
        result.error.issues.map((issue) => issue.message).join("\n"),
      );
  };
}

/** Use for irrecoverable programming errors. (eg. service got an undefined db instance) */
export function panic(message: string): never {
  throw new Error(`PANIC: ${message}`);
}
