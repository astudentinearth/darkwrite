import { FontStyle } from "@/common/note-customization";
import { useNoteContent, useUpdateNoteContent } from "@/query/use-note-content";
import { produce } from "immer";

export default function useStylePopover(id: string) {
  const query = useNoteContent(id);
  const mutation = useUpdateNoteContent(id);

  const setFont = (fontStyle: FontStyle, customFont?: string) => {
    if (!query.data) return;
    const content = produce(query.data, (draft) => {
      draft.customizations.font = fontStyle;
      if(customFont) draft.customizations.customFont = customFont;
    });
    mutation.mutate({ content, debounce: false });
    query.overrideCache(content);
  };

  const setColor = (type: "backgroundColor" | "textColor", value: string | undefined) => {
    if(!query.data) return;
    const content = produce(query.data, draft => {
      draft.customizations[type] = value;
    })
    mutation.mutate({content, debounce: true})
  }

  return { setFont, setColor};
}
