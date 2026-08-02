import { getEmbedUrl } from "@darkwrite/common";
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
import { useAppSelector, useAppStore } from "@/features/store/hooks";
import { getCurrentWorkspaceId } from "@/features/workspaces/store/workspace.thunk";
import { uploadImage } from "@/lib/upload-image";
import { useEditorActions } from "../store/editor-actions";

export default function useEditorCover(noteId: string) {
  const titleUpdater = useTitleUpdater(noteId);
  const title = useAppSelector((s) => selectNoteTitle(s, noteId));
  const icon = useAppSelector((s) => selectNoteIcon(s, noteId));
  const coverImageSource = useAppSelector((s) =>
    selectCoverImageSource(s, noteId),
  );
  const { setEditorCustomizations } = useEditorActions();
  const store = useAppStore();

  const wide = useAppSelector((s) => selectIsWidePage(s, noteId));

  const addCover = async () => {
    const embed = await uploadImage(() =>
      getCurrentWorkspaceId(store.getState),
    );
    setEditorCustomizations(noteId, {
      coverImageSource: getEmbedUrl(embed.id),
    });
  };

  return {
    updateTitle: titleUpdater.update,
    updateIcon: (icon: string | null) => titleUpdater.updateIcon(noteId, icon),
    addCover,
    hasCover: !!coverImageSource,
    wide,
    title,
    icon,
  };
}
