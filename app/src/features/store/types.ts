import { store } from "./redux";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type Selector<argType, retType> = (state: RootState, arg: argType) => retType;

