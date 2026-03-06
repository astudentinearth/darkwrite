import { useMemo } from "react";
import { useAppStore } from "../store/hooks";
import { AppStore } from "../store/redux";
import { appSessionSlice } from "./session-slice";

export function getSessionActions(store: AppStore) {
  function setAllNotesViewOpen(open: boolean) {
    store.dispatch(appSessionSlice.actions.setAllNotesViewOpen(open));
  }

  function setFavoritesViewOpen(open: boolean) {
    store.dispatch(appSessionSlice.actions.setFavoritesViewOpen(open));
  }

  return {
    setAllNotesViewOpen,
    setFavoritesViewOpen,
  };
}

export function useSessionActions() {
  const store = useAppStore();
  const actions = useMemo(() => getSessionActions(store), [store]);
  return actions;
}
