import { FontStyle } from "@/common/note-customization";
import {
  setEditorCustomizations,
  useEditorStore,
} from "@/context/editor-store";
import { produce } from "immer";

export default function useStylePopover() {
  const customizations = useEditorStore((s) => s.customizations);

  const setFont = (fontStyle: FontStyle, customFont?: string) => {
    const updated = produce(customizations, (draft) => {
      draft.font = fontStyle;
      if (customFont) draft.customFont = customFont;
    });
    setEditorCustomizations(updated);
  };

  const setColor = (
    type: "backgroundColor" | "textColor",
    value: string | undefined,
  ) => {
    const updated = produce(customizations, (draft) => {
      draft[type] = value;
    });
    setEditorCustomizations(updated, true);
  };

  const setWide = (wide: boolean) => {
    const content = produce(customizations, (draft) => {
      draft.widePage = wide;
    });
    setEditorCustomizations(content);
  };

  return { setFont, setColor, setWide };
}
