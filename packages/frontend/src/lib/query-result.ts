/** biome-ignore-all lint/suspicious/noExplicitAny: variadic functions */

import type { ResultAsync } from "neverthrow";

export type QueryResult<T, E> = { data: T } | { error: E };
export type ResultQueryFn<T, E, Args extends any[]> = (
  ...args: Args
) => Promise<QueryResult<T, E>>;

export function resultQueryFn<T, E, Args extends any[]>(
  apiMethod: (...args: Args) => ResultAsync<T, E>,
): ResultQueryFn<T, E, Args>;

export function resultQueryFn<T, E, Args extends any[], R>(
  apiMethod: (...args: Args) => ResultAsync<T, E>,
  transform: (response: T) => R,
): ResultQueryFn<R, E, Args>;

export function resultQueryFn<T, E, Args extends any[], R>(
  apiMethod: (...args: Args) => ResultAsync<T, E>,
  transform?: (response: T) => R,
) {
  return (...args: Args) =>
    apiMethod(...args)
      .orTee(console.error)
      .match(
        (value) => ({ data: transform ? transform(value) : value }),
        (error) => ({ error }),
      );
}
