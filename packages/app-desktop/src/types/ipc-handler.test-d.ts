import { expectTypeOf } from "vitest";
import type { IpcMainInvokeEvent } from "electron";
import { Result, ResultAsync, ok } from "neverthrow";
import {
  type IPCListener,
  type GetMainHandlerParams,
  type GetPreloadReturnType,
  type InferHandler,
  type IPCPreloadHandler,
  IPCHandler,
  InferPreloadAPI,
  HandlerImplements,
} from "./ipc-handler";

type ipcWithoutEvent = (value: string, count: number) => Result<number, string>;
type ipcWithoutEvent2 = (value: string) => ResultAsync<number, string>;
type ipcWithEvent = (
  event: IpcMainInvokeEvent,
  value: string,
  count: number,
) => Result<number, string>;
type ipcWithEvent2 = (
  event: IpcMainInvokeEvent,
  value: string,
) => ResultAsync<number, string>;

// test function compatibility

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
expectTypeOf<Return1>().toEqualTypeOf<ResultAsync<number, string>>();

type Return2 = GetPreloadReturnType<ipcWithoutEvent2>;
expectTypeOf<Return2>().toEqualTypeOf<ResultAsync<number, string>>();

type Return3 = GetPreloadReturnType<ipcWithEvent>;
expectTypeOf<Return3>().toEqualTypeOf<ResultAsync<number, string>>();

type Return4 = GetPreloadReturnType<ipcWithEvent2>;
expectTypeOf<Return4>().toEqualTypeOf<ResultAsync<number, string>>();

// test preload handler inference

type PreloadHandler1 = IPCPreloadHandler<ipcWithoutEvent>;
expectTypeOf<PreloadHandler1>().toEqualTypeOf<
  (value: string, count: number) => ResultAsync<number, string>
>();

type PreloadHandler2 = IPCPreloadHandler<ipcWithoutEvent2>;
expectTypeOf<PreloadHandler2>().toEqualTypeOf<
  (value: string) => ResultAsync<number, string>
>();

type PreloadHandler3 = IPCPreloadHandler<ipcWithEvent>;
expectTypeOf<PreloadHandler3>().toEqualTypeOf<
  (value: string, count: number) => ResultAsync<number, string>
>();

type PreloadHandler4 = IPCPreloadHandler<ipcWithEvent2>;
expectTypeOf<PreloadHandler4>().toEqualTypeOf<
  (value: string) => ResultAsync<number, string>
>();

// test wrapper class

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const handlerWithoutEvent = new IPCHandler(
  false,
  (value: string, count: number): Result<number, string> => {
    return ok(count);
  },
);

expectTypeOf<InferHandler<typeof handlerWithoutEvent>>().toEqualTypeOf<
  (value: string, count: number) => ResultAsync<number, string>
>();

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const handlerWithEvent = new IPCHandler(
  true,
  (
    event: IpcMainInvokeEvent,
    value: string,
    count: number,
  ): Result<number, string> => {
    return ok(count);
  },
);

expectTypeOf<InferHandler<typeof handlerWithEvent>>().toEqualTypeOf<
  (value: string, count: number) => ResultAsync<number, string>
>();

// test full inference

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const createNote = (name: string, count: number) => {
  return ok(null);
};

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const exit = (event: IpcMainInvokeEvent) => {
  return ok();
};

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
    create: (name: string, count: number) => ResultAsync<null, never>;
  };
  exit: () => ResultAsync<void, never>;
}>();

// test union type parameter

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const handlerWithUnion = new IPCHandler(
  false,
  (id: string | null): Result<string | null, string> => {
    return ok(id);
  },
);

type UnionHandlerType = typeof handlerWithUnion;
type UnionListener = UnionHandlerType["listener"];
type UnionParams = GetMainHandlerParams<UnionListener>;
type UnionReturn = GetPreloadReturnType<UnionListener>;
type UnionInferred = InferHandler<UnionHandlerType>;

expectTypeOf<UnionParams>().toEqualTypeOf<[string | null]>();
expectTypeOf<UnionReturn>().toEqualTypeOf<ResultAsync<string | null, string>>();
expectTypeOf<UnionInferred>().toEqualTypeOf<
  (id: string | null) => ResultAsync<string | null, string>
>();

interface ITest {
  method: (value: string) => ResultAsync<string, string>;
}

interface ITest_impltype {
  method:
    | IPCHandler<
        false,
        (value: string) => Result<string, string> | ResultAsync<string, string>
      >
    | IPCHandler<
        true,
        (
          e: IpcMainInvokeEvent,
          value: string,
        ) => Result<string, string> | ResultAsync<string, string>
      >;
}

expectTypeOf<HandlerImplements<ITest>>().toEqualTypeOf<ITest_impltype>();
