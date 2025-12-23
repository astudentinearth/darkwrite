import { expectTypeOf } from "vitest";
import type { IpcMainInvokeEvent } from "electron";
import {
  type IPCListener,
  type GetMainHandlerParams,
  type GetPreloadReturnType,
  type InferHandler,
  type IPCPreloadHandler,
  IPCHandler,
  DarkwriteAPI,
  InferPreloadAPI,
} from "./ipc-handler";

type ipcWithoutEvent = (value: string, count: number) => number;
type ipcWithoutEvent2 = (value: string) => Promise<number>;
type ipcWithEvent = (
  event: IpcMainInvokeEvent,
  value: string,
  count: number,
) => number;
type ipcWithEvent2 = (
  event: IpcMainInvokeEvent,
  value: string,
) => Promise<number>;

// test function compatbility

expectTypeOf<ipcWithoutEvent>().toExtend<IPCListener<false>>();
expectTypeOf<ipcWithoutEvent2>().toExtend<IPCListener<false>>();
expectTypeOf<ipcWithEvent>().toExtend<IPCListener<true>>();
expectTypeOf<ipcWithEvent2>().toExtend<IPCListener<true>>();

// test GetMainHandlerParams

type Params1 = GetMainHandlerParams<ipcWithoutEvent>;
expectTypeOf<Params1>().toEqualTypeOf<[string, number]>();

type Params2 = GetMainHandlerParams<ipcWithoutEvent2>;
expectTypeOf<Params2>().toEqualTypeOf<[string]>();

type Params3 = GetMainHandlerParams<ipcWithEvent>;
expectTypeOf<Params3>().toEqualTypeOf<[string, number]>();

type Params4 = GetMainHandlerParams<ipcWithEvent2>;
expectTypeOf<Params4>().toEqualTypeOf<[string]>();

// test preload return type

type Return1 = GetPreloadReturnType<ipcWithoutEvent>;
expectTypeOf<Return1>().toEqualTypeOf<Promise<number>>();

type Return2 = GetPreloadReturnType<ipcWithoutEvent2>;
expectTypeOf<Return2>().toEqualTypeOf<Promise<number>>();

type Return3 = GetPreloadReturnType<ipcWithEvent>;
expectTypeOf<Return3>().toEqualTypeOf<Promise<number>>();

type Return4 = GetPreloadReturnType<ipcWithEvent2>;
expectTypeOf<Return4>().toEqualTypeOf<Promise<number>>();

// test preload handler inference

type PreloadHandler1 = IPCPreloadHandler<ipcWithoutEvent>;
expectTypeOf<PreloadHandler1>().toEqualTypeOf<
  (value: string, count: number) => Promise<number>
>();

type PreloadHandler2 = IPCPreloadHandler<ipcWithoutEvent2>;
expectTypeOf<PreloadHandler2>().toEqualTypeOf<
  (value: string) => Promise<number>
>();

type PreloadHandler3 = IPCPreloadHandler<ipcWithEvent>;
expectTypeOf<PreloadHandler3>().toEqualTypeOf<
  (value: string, count: number) => Promise<number>
>();

type PreloadHandler4 = IPCPreloadHandler<ipcWithEvent2>;
expectTypeOf<PreloadHandler4>().toEqualTypeOf<
  (value: string) => Promise<number>
>();

// test wrapper class

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const handlerWithoutEvent = new IPCHandler(
  false,
  (value: string, count: number) => {
    return count;
  },
);

expectTypeOf<InferHandler<typeof handlerWithoutEvent>>().toEqualTypeOf<
  (value: string, count: number) => Promise<number>
>();

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const handlerWithEvent = new IPCHandler(
  true,
  (event: IpcMainInvokeEvent, value: string, count: number) => {
    return count;
  },
);

expectTypeOf<InferHandler<typeof handlerWithEvent>>().toEqualTypeOf<
  (value: string, count: number) => Promise<number>
>();

// test full inference

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const createNote = (name: string, count: number) => {
  return null;
};

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const exit = (event: IpcMainInvokeEvent) => {};

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const api = {
  note: {
    create: new IPCHandler(false, createNote),
  },
  exit: new IPCHandler(true, exit),
} satisfies DarkwriteAPI;

type PreloadAPI = InferPreloadAPI<typeof api>;

expectTypeOf<PreloadAPI>().toEqualTypeOf<{
  note: {
    create: (name: string, count: number) => Promise<null>;
  };
  exit: () => Promise<void>;
}>();
