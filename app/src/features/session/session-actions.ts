import { store } from "../store/redux";
import { appSessionSlice } from "./session-slice";

export function setAllNotesViewOpen(open: boolean) {
  store.dispatch(appSessionSlice.actions.setAllNotesViewOpen(open));
}

export function setFavoritesViewOpen(open: boolean) {
  store.dispatch(appSessionSlice.actions.setFavoritesViewOpen(open));
}
