import { DEFAULT_NOTE_ICON } from "@darkwrite/common"
import { Button } from "@/components/ui";
import { EditorContext } from "@/features/editor/store/editor-context";
import { selectNoteIcon } from "@/features/note/store/note-selectors";
import { useTitleUpdater } from "@/features/note/store/update-note";
import { useAppSelector } from "@/features/store/hooks";
import { Frown, Smile } from "lucide-react";
import { use } from "react";
import { useTranslation } from "react-i18next";

export function AddRemoveIconButton() {
  const { noteId } = use(EditorContext);
  const { t } = useTranslation();
  const icon = useAppSelector((s) => selectNoteIcon(s, noteId));
  const { updateIcon } = useTitleUpdater(noteId);

  return icon ? (
    <Button
      onClick={() => updateIcon(noteId, null)}
      className="w-fit"
      variant={"ghost"}
    >
      <Frown size={18} />
      {t("editor.cover.removeIcon")}
    </Button>
  ) : (
    <Button
      onClick={() => updateIcon(noteId, DEFAULT_NOTE_ICON)}
      className="w-fit"
      variant={"ghost"}
    >
      <Smile size={18} />
      {t("editor.cover.addIcon")}
    </Button>
  );
}
