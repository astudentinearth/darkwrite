import { useAppSelector } from "@/features/store/hooks";
import { searchCurrentWorkspace } from "../store/note-selectors";

export function useSearch(query: string) {
  const results = useAppSelector((s) => searchCurrentWorkspace(s, query));

  return {
    results,
  };
}
