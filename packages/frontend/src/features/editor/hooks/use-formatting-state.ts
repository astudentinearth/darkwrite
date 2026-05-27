import { useAppSelector } from "@/features/store/hooks";
import { selectFormattingState } from "../store/editor-selectors";
import type { FormattingState } from "../store/editor-slice";

/** Subscribe to the formatting state for the editor selection for given note id. Returns default state if not available. */
export function useFormattingState(noteId: string): FormattingState {
  const formattingState = useAppSelector((s) =>
    selectFormattingState(s, noteId),
  );
  return (
    formattingState ?? {
      isBold: false,
      isItalic: false,
      isUnderline: false,
      isStrikethrough: false,
      isCode: false,
      isQuote: false,
      isLink: false,
    }
  );
}
