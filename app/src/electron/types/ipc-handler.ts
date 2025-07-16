/* eslint-disable @typescript-eslint/no-explicit-any */
import { type IpcMainInvokeEvent } from "electron";
import { Promisfy, type OmitFirstParameter } from "@darkwrite/common";

export type IPCMainListener = (
  event: IpcMainInvokeEvent,
  ...args: any[]
) => Promise<any> | any;

export type IPCMainListenerWithoutEvent = OmitFirstParameter<IPCMainListener>;

export type IPCMainListenerUnion =
  | IPCMainListener
  | IPCMainListenerWithoutEvent;

export type IPCListener<WithEvent extends boolean> = WithEvent extends true
  ? IPCMainListener
  : IPCMainListenerWithoutEvent;

export type GetMainHandlerParams<Handler extends IPCMainListenerUnion> =
  Parameters<Handler> extends [infer First, ...args: infer Args]
    ? First extends Electron.IpcMainInvokeEvent
      ? Args
      : Parameters<Handler>
    : [];

export type GetPreloadReturnType<Handler extends IPCMainListenerUnion> =
  Promisfy<ReturnType<Handler>>;

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
