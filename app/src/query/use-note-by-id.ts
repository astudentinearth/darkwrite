import { DarkwriteAPIClient } from "@/api/api-client";
import { useQuery } from "@tanstack/react-query";

export function useNoteById(noteId: string) {
  const query = useQuery({
    queryKey: ["note", noteId],
    queryFn: ()=>DarkwriteAPIClient.note.getById(noteId)
  })
  const { data, isFetching, isError, refetch } = query;
  return {
    note: data?.note,
    isFetching,
    isError,
    refetch
  }
}