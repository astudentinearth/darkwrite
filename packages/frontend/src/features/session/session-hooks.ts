import { useAppSelector } from "../store/hooks";
import {
  selectAllNotesViewOpen,
  selectFavoritesViewOpen,
} from "./session-selectors";

export const useAllNotesViewOpen = () => useAppSelector(selectAllNotesViewOpen);
export const useFavoritesViewOpen = () =>
  useAppSelector(selectFavoritesViewOpen);
