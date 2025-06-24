import { APIClient } from "@renderer/apiv2/client";
import { useQuery } from "@tanstack/react-query";

export const useNoteByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["note", id],
    queryFn: async () => {
      console.log(`Fetching note with id: ${id}`);
      const data = await APIClient.instance.note.getNote(id);
      if(!data) throw new Error(`Could not fetch note ${id}`);
      return data.note;
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5, // 5 minutes,
    refetchOnWindowFocus: false,
  });
};
