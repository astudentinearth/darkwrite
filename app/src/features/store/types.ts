import type { AppStore } from "./redux";

export type { AppStore };
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export type Selector<argType, retType> = (
  state: RootState,
  arg: argType,
) => retType;
