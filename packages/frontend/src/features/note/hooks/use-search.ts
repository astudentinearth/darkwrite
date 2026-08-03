import _ from "lodash";
import { useAppSelector } from "@/features/store/hooks";
import { useCurrentWorkspaceId } from "@/features/workspaces/hooks/use-workspace";
import { selectByWorkspaceAndSearchTerm } from "../store/note-selectors";

export function useSearch(query: string) {
  const workspaceId = useCurrentWorkspaceId() ?? "";
  const results = useAppSelector((s) =>
    selectByWorkspaceAndSearchTerm(s, { query, workspaceId }),
  );

  return {
    results,
  };
}
