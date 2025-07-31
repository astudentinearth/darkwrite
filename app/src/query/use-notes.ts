import { DarkwriteAPIClient } from "@/api/api-client";
import { useLocalStore } from "@/context/local-state"
import { useQuery } from "@tanstack/react-query";

export const useNotes = () => {
  const workspaceId = useLocalStore(s => s.workspaceId);
  
  const query = useQuery({
    queryKey: [workspaceId, "notes"],
    queryFn: async () => {
      const response = await DarkwriteAPIClient.note.getAllByWorkspaceId(workspaceId)
      const notes = response.notes.toSorted((a, b) => a.orderHint.localeCompare(b.orderHint));
      return notes;
    }
  })

  const { data, isFetching, refetch} = query;
  return { notes: data, isFetching, refetch }
}