import { Undo2 } from "lucide-react";
import { use } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui";
import Alert from "@/components/ui/alert";
import { useNoteById } from "@/features/note/hooks/use-note-by-id";
import { useNoteActions } from "@/features/note/store/note-actions";
import { EditorContext } from "../store/editor-context";

export default function TrashBanner() {
  const { t } = useTranslation();
  const { noteId } = use(EditorContext);
  const { note } = useNoteById(noteId);
  const { restoreFromTrash } = useNoteActions();
  if (!note?.isTrashed) return <></>;

  return (
    <Alert className="grid grid-cols-[1fr_auto] p-2 pl-4 top-highlight items-center">
      {t("editor.cover.trashWarning")}
      <Button
        onClick={() => restoreFromTrash(noteId)}
        variant={"secondary"}
        className="w-fit"
      >
        <Undo2 className="size-4" />
        {t("sidebar.trash.restore")}
      </Button>
    </Alert>
  );
}
