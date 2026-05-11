/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-redeclare */
import { ExtractResultTypes, type OmitFirstParameter } from "@darkwrite/common";
import { type IpcMainInvokeEvent } from "electron";
import { Result, ResultAsync } from "neverthrow";

export type IPCMainListener = (
  event: IpcMainInvokeEvent,
  ...args: any[]
) => ResultAsync<any, any> | Result<any, any>;

export type IPCMainListenerWithoutEvent = OmitFirstParameter<IPCMainListener>;

export type IPCMainListenerUnion =
  | IPCMainListener
  | IPCMainListenerWithoutEvent;

export type IPCListener<WithEvent extends boolean> = WithEvent extends true
  ? IPCMainListener
  : IPCMainListenerWithoutEvent;

export type GetMainHandlerParams<Handler extends IPCMainListenerUnion> =
  Parameters<Handler> extends [infer First, ...args: infer Args]
    ? [First] extends [Electron.IpcMainInvokeEvent]
      ? Args
      : Parameters<Handler>
    : [];

export type GetPreloadReturnType<Handler extends IPCMainListenerUnion> =
  ExtractResultTypes<Handler> extends [infer T, infer E]
    ? ResultAsync<T, E>
    : never;

export type IPCPreloadHandler<Handler extends IPCMainListenerUnion> = (
  ...args: GetMainHandlerParams<Handler>
) => GetPreloadReturnType<Handler>;

export class IPCHandler<
  WithEvent extends boolean,
  Listener extends IPCListener<WithEvent> = IPCListener<WithEvent>,
> {
  public readonly withEvent: WithEvent;
  public listener: Listener;

  constructor(withEvent: WithEvent, listener: Listener) {
    this.withEvent = withEvent;
    this.listener = listener;
  }
}

export interface DarkwriteAPI {
  [Key: string]: IPCHandler<boolean> | DarkwriteAPI;
}
export type InferHandler<Listener extends IPCHandler<boolean>> =
  IPCPreloadHandler<Listener["listener"]>;

export type InferPreloadAPI<API> = {
  [Key in keyof API]: API[Key] extends IPCHandler<boolean>
    ? InferHandler<API[Key]>
    : API[Key] extends object
      ? InferPreloadAPI<API[Key]>
      : API[Key];
};

export function handler<T extends IPCListener<false>>(
  fn: T,
  withEvent?: false,
): IPCHandler<false, T>;
export function handler<T extends IPCListener<true>>(
  fn: T,
  withEvent: true,
): IPCHandler<true, T>;
export function handler<T extends IPCMainListenerUnion>(
  fn: T,
  withEvent: boolean = false,
): IPCHandler<boolean, T> {
  return new IPCHandler(withEvent, fn);
}

export type AddSyncResult<T> =
  T extends ResultAsync<infer V, infer E>
    ? T | Result<V, E>
    : // eslint-disable-next-line @typescript-eslint/no-unused-vars
      T extends Result<infer _V, infer _E>
      ? T
      : never;

export type HandlerForFn<T extends (...args: any[]) => any> =
  | IPCHandler<false, (...args: Parameters<T>) => AddSyncResult<ReturnType<T>>>
  | IPCHandler<
      true,
      (
        event: IpcMainInvokeEvent,
        ...args: Parameters<T>
      ) => AddSyncResult<ReturnType<T>>
    >;

export type HandlerImplements<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? HandlerForFn<T[K]>
    : HandlerImplements<T[K]>;
};
