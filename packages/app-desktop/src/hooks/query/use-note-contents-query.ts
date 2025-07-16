import { NoteCustomization } from "@darkwrite/common/models";
import { NoteAPI } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { type EditorContent } from "@darkwrite/editor";
export const useNoteContentsQuery = (id: string) => {
  return useQuery({
    queryKey: ["note-content", id],
    queryFn: async () => {
      const response = await NoteAPI().getContents(id);
      if (!response) {
        return {
          content: {} as EditorContent,
          customizations: {} as NoteCustomization,
        };
      }
      //console.log("Read file: ", response.value);
      const json = JSON.parse(response);
      const content = (json["contents"] ?? {}) as EditorContent;
      const customizations = (json["customizations"] ??
        {}) as NoteCustomization;
      //console.log(content);
      return { content, customizations };
    },
    enabled: Boolean(id),
    refetchOnWindowFocus: false,
    staleTime: 1,
  });
};
