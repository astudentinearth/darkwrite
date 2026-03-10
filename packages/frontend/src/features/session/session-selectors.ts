import { RootState } from "../store/types";

export const selectAllNotesViewOpen = (state: RootState) =>
  state.session.allNotesViewOpen;
export const selectFavoritesViewOpen = (state: RootState) =>
  state.session.favoritesViewOpen;
