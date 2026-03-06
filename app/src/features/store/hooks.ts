import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  useStore,
} from "react-redux";
import type { RootState, AppDispatch, AppStore } from "./types";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore = useStore.withTypes<AppStore>();
