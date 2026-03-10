import {
  selectCoverImageSource,
  selectIsWidePage,
} from "@/features/editor/store/editor-selectors";
import { useNoteActions } from "@/features/note/store/note-actions";
import {
  selectNoteIcon,
  selectNoteTitle,
} from "@/features/note/store/note-selectors";
import { useTitleUpdater } from "@/features/note/store/update-note";
import { useAppSelector } from "@/features/store/hooks";
import { uploadImage } from "@/lib/upload-image";
import { useEditorActions } from "../store/editor-actions";
import { useWorkspaceActions } from "@/features/workspaces/store/workspace-actions";

export default function useEditorCover(noteId: string) {
  const titleUpdater = useTitleUpdater(noteId);
  const title = useAppSelector((s) => selectNoteTitle(s, noteId));
  const icon = useAppSelector((s) => selectNoteIcon(s, noteId));
  const { restoreFromTrash } = useNoteActions();
  const { getCurrentWorkspaceId } = useWorkspaceActions();
  const coverImageSource = useAppSelector((s) =>
    selectCoverImageSource(s, noteId),
  );
  const { setEditorCustomizations } = useEditorActions();

  const wide = useAppSelector((s) => selectIsWidePage(s, noteId));

  const addCover = async () => {
    const embed = await uploadImage(getCurrentWorkspaceId);
    setEditorCustomizations(noteId, { coverImageSource: embed.url });
  };

  const restore = async () => restoreFromTrash(noteId);

  return {
    updateTitle: titleUpdater.update,
    updateIcon: (icon: string | null) => titleUpdater.updateIcon(noteId, icon),
    addCover,
    restore,
    hasCover: !!coverImageSource,
    wide,
    title,
    icon,
  };
}
