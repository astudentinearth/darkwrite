// @vitest-environment jsdom

import { DebouncedUpdater } from "./debounced-updater";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it("should only care about the last write on subsequent writes", () => {
  const fn = vi.fn(async (_val: string) => {});

  const updater = DebouncedUpdater(fn, { delay: 100 });
  updater.update("first");
  updater.update("second");
  updater.update("last");

  vi.advanceTimersByTime(100);

  expect(fn).not.toHaveBeenCalledWith("first");
  expect(fn).not.toHaveBeenCalledWith("second");
  expect(fn).toHaveBeenCalledWith("last");
});

it("should not fire early", () => {
  const fn = vi.fn(async (_val: string) => {});
  const updater = DebouncedUpdater(fn, { delay: 500 });

  updater.update("arg");
  vi.advanceTimersByTime(499);

  expect(fn).not.toHaveBeenCalled();

  vi.advanceTimersByTime(5);
  expect(fn).toHaveBeenCalledWith("arg");
});

it("should flush before unload", () => {
  const fn = vi.fn(async (_val: string) => {});
  const updater = DebouncedUpdater(fn, { delay: 500 });
  updater.update("arg");

  window.dispatchEvent(new Event("beforeunload"));

  expect(fn).toHaveBeenCalledWith("arg");
});

it("should flush only once", () => {
  const fn = vi.fn(async (_val: string) => {});
  const updater = DebouncedUpdater(fn, { delay: 500 });
  updater.update("arg");

  window.dispatchEvent(new Event("beforeunload"));
  window.dispatchEvent(new Event("beforeunload"));
  expect(fn).toHaveBeenCalledExactlyOnceWith("arg");
});

it("should not disconnect event handlers if another update happens mid flight", async () => {
  const fn = vi.fn(() => new Promise((resolve) => setTimeout(resolve, 50)));
  const updater = DebouncedUpdater(fn, { delay: 150 });
  updater.update();
  await vi.advanceTimersByTimeAsync(151);
  expect(fn).toHaveBeenCalledTimes(1);

  updater.update();

  // resolve the promise
  await vi.advanceTimersByTimeAsync(51);
  // should flush if not disconnected
  window.dispatchEvent(new Event("beforeunload"));

  expect(fn).toHaveBeenCalledTimes(2);
});

// type tests

const _updater = DebouncedUpdater(async (_a: string, _b: number) => 3);
expectTypeOf(_updater.update).toEqualTypeOf<(a: string, b: number) => void>();
