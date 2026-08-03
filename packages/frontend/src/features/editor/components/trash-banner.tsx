import { Undo2 } from "lucide-react";
import { use } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui";
import Alert from "@/components/ui/alert";
import { useNoteById } from "@/features/note/hooks/use-note-by-id";
import {
  restoreFailToast,
  restoreSuccessToast,
} from "@/features/note/note.toast";
import { restoreFromTrash } from "@/features/note/store/note.thunk";
import { useAppDispatch } from "@/features/store/hooks";
import { EditorContext } from "../store/editor-context";

export default function TrashBanner() {
  const { t } = useTranslation();
  const { noteId } = use(EditorContext);
  const { note } = useNoteById(noteId);
  const dispatch = useAppDispatch();
  if (!note?.isTrashed) return <></>;

  return (
    <Alert className="grid grid-cols-[1fr_auto] font-ui p-2 pl-4 top-highlight items-center">
      {t("editor.cover.trashWarning")}
      <Button
        onClick={() =>
          dispatch(restoreFromTrash(noteId))
            .andTee(restoreSuccessToast)
            .orTee(restoreFailToast)
        }
        variant={"secondary"}
        className="w-fit"
      >
        <Undo2 className="size-4" />
        {t("sidebar.trash.restore")}
      </Button>
    </Alert>
  );
}
