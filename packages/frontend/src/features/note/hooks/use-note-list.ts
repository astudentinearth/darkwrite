import { useAppSelector } from "@/features/store/hooks";
import { selectSidebarTree } from "../store/notes-ui-selectors";

export function useNoteList() {
  const items = useAppSelector(selectSidebarTree);

  return { items };
}
