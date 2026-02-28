import { setEditorCustomizations } from "@/features/editor/store/editor-actions";
import {
  selectCoverImageSource,
  selectIsWidePage,
} from "@/features/editor/store/editor-selectors";
import { restoreFromTrash } from "@/features/note/store/note-actions";
import {
  selectNoteIcon,
  selectNoteTitle,
} from "@/features/note/store/note-selectors";
import {
  createTitleUpdater,
  updateIcon,
} from "@/features/note/store/update-note";
import { useAppSelector } from "@/features/store/hooks";
import { uploadImage } from "@/lib/upload-image";
import { useMemo } from "react";

export default function useEditorCover(noteId: string) {
  const titleUpdater = useMemo(() => createTitleUpdater(noteId), [noteId]);
  const title = useAppSelector((s) => selectNoteTitle(s, noteId));
  const icon = useAppSelector((s) => selectNoteIcon(s, noteId));
  const coverImageSource = useAppSelector((s) =>
    selectCoverImageSource(s, noteId),
  );

  const wide = useAppSelector((s) => selectIsWidePage(s, noteId));

  const addCover = async () => {
    const embed = await uploadImage();
    setEditorCustomizations(noteId, { coverImageSource: embed.url });
  };

  const restore = async () => restoreFromTrash(noteId);

  return {
    updateTitle: titleUpdater.update,
    updateIcon: (icon: string | null) => updateIcon(noteId, icon),
    addCover,
    restore,
    hasCover: !!coverImageSource,
    wide,
    title,
    icon,
  };
}
