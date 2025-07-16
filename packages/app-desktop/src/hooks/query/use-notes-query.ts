import { APIClient } from "@/apiv2/client";
import { useQuery } from "@tanstack/react-query";

export const useNotesQuery = () => {
  return useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      console.log("Fetching notes");
      const data = await APIClient.instance.note.getAllNotes();
      return data.notes;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
  });
};
