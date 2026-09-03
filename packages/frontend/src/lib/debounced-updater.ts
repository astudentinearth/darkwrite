import _ from "lodash";
import { useMemo } from "react";

export type DebounceOptions = {
  delay?: number;
} & _.DebounceSettings;
// biome-ignore lint/suspicious/noExplicitAny: generic function
export type DebouncedUpdateFn = (...args: any[]) => PromiseLike<any>;
type CleanupFn = (() => void) | null;

const DEFAULT_DELAY = 150;

export function DebouncedUpdater<OnUpdate extends DebouncedUpdateFn>(
  onUpdate: OnUpdate,
  { delay = DEFAULT_DELAY, ...opts }: DebounceOptions = {},
) {
  let cleanupFn: CleanupFn = null;
  let generation = 0;

  const disconnect = () => {
    if (cleanupFn !== null) {
      window.removeEventListener("beforeunload", cleanupFn);
      cleanupFn = null;
    }
  };

  const debounced = _.debounce(
    async (...args: Parameters<OnUpdate>) => {
      const currentGeneration = generation;
      try {
        await onUpdate(...args);
      } finally {
        if (generation === currentGeneration) disconnect();
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
        disconnect();
      };
      window.addEventListener("beforeunload", cleanupFn);
    }

    generation++;
    debounced(...args);
  };

  return { update };
}

export type DebouncedUpdater<T extends Parameters<typeof DebouncedUpdater>[0]> =
  ReturnType<typeof DebouncedUpdater<T>>;

export const useDebouncedUpdater = <T extends DebouncedUpdateFn>(fn: T) =>
  useMemo(() => DebouncedUpdater(fn), [fn]);

export function KeyedDebouncedUpdater<Key, OnUpdate extends DebouncedUpdateFn>(
  onUpdate: OnUpdate,
  opts: DebounceOptions = {},
) {
  const map = new Map<Key, DebouncedUpdater<OnUpdate>>();

  const getUpdater = (key: Key) => {
    const val = map.get(key);
    if (!val) {
      const updater = DebouncedUpdater(onUpdate, opts);
      map.set(key, updater);
      return updater;
    }
    return val;
  };

  return {
    for: getUpdater,
  };
}

export type KeyedDebouncedUpdater<
  K,
  T extends Parameters<typeof KeyedDebouncedUpdater>[0],
> = ReturnType<typeof KeyedDebouncedUpdater<K, T>>;
