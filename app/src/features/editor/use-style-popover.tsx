import { FontStyle } from "@/common/note-customization";
import { useNoteContent, useUpdateNoteContent } from "@/query/use-note-content";
import { produce } from "immer";

export default function useStylePopover(id: string) {
  const query = useNoteContent(id);
  const mutation = useUpdateNoteContent(id);

  const setFont = (fontStyle: FontStyle) => {
    if (!query.data) return;
    const content = produce(query.data, (draft) => {
      draft.customizations.font = fontStyle;
    });
    mutation.mutate({ content, debounce: false });
    query.overrideCache(content);
  };

  return { setFont };
}
