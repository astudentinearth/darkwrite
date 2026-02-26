import { Button } from "@/components/ui";
import Alert from "@/components/ui/alert";
import { Undo2 } from "lucide-react";
import { use } from "react";
import { useTranslation } from "react-i18next";
import { EditorContext } from "../store/editor-context";
import { useNoteById } from "@/features/note/hooks/use-note-by-id";
import { restoreFromTrash } from "@/features/note/store/note-actions";

export default function TrashBanner() {
  const { t } = useTranslation();
  const { noteId } = use(EditorContext);
  const { note } = useNoteById(noteId);
  if (!note?.isTrashed) return <></>;

  return (
    <Alert>
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
  )
}

