import _ from "lodash";
import { useMemo } from "react";

export type DebounceOptions = { delay?: number } & _.DebounceSettings;
// biome-ignore lint/suspicious/noExplicitAny: generic function
export type DebouncedUpdateFn = (...args: any[]) => PromiseLike<any>;
type CleanupFn = (() => void) | null;

export function DebouncedUpdater<OnUpdate extends DebouncedUpdateFn>(
  onUpdate: OnUpdate,
  { delay = 150, ...opts }: DebounceOptions = {},
) {
  let cleanupFn: CleanupFn = null;

  const debounced = _.debounce(
    async (...args: Parameters<OnUpdate>) => {
      try {
        await onUpdate(...args);
      } finally {
        cleanupFn?.();
      }
    },
    delay,
    opts,
  );

  const update = (...args: Parameters<OnUpdate>) => {
    if (cleanupFn === null) {
      // ensure updates are never lost
      cleanupFn = () => {
        debounced.flush();
        if (cleanupFn !== null) {
          window.removeEventListener("beforeunload", cleanupFn);
          cleanupFn = null;
        }
      };
      window.addEventListener("beforeunload", cleanupFn);
    }

    debounced(...args);
  };

  return { update };
}

export type DebouncedUpdater<T extends Parameters<typeof DebouncedUpdater>[0]> =
  ReturnType<typeof DebouncedUpdater<T>>;

export const useDebouncedUpdater = <T extends DebouncedUpdateFn>(fn: T) =>
  useMemo(() => DebouncedUpdater(fn), [fn]);
