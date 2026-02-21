import { DarkwriteAPIClient } from "@/api/api-client";
import { NoteDTO, NoteResponseDTO } from "@/common/dto";
import { useLocalStore } from "@/context/local-state";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import { produce } from "immer";
import { uploadImage } from "@/lib/upload-image";
import {
  setEditorCustomizations,
  useEditorStore,
} from "@/context/editor-store";
import { useMemo } from "react";
import {
  createTitleUpdater,
  updateIcon,
} from "@/features/note/store/update-note";
import { restoreFromTrash } from "@/features/note/store/note-actions";

export default function useEditorCover(noteId: string) {
  const titleUpdater = useMemo(() => createTitleUpdater(noteId), [noteId]);

  const addCover = async () => {
    const embed = await uploadImage();
    const updated = produce(customizations, (draft) => {
      draft.coverImageSource = embed.url;
    });
    setEditorCustomizations(updated);
  };

  const onCoverImageSourceChange = async (
    source: string | null | undefined,
  ) => {
    const updated = produce(customizations, (draft) => {
      draft.coverImageSource = source || undefined;
    });
    setEditorCustomizations(updated);
  };

  const restore = async () => restoreFromTrash(noteId);

  return {
    updateTitle: titleUpdater.update,
    updateIcon: (icon: string | null) => updateIcon(noteId, icon),
    addCover,
    onCoverImageSourceChange,
    restore,
  };
}
