import { selectCoverImageSource } from "@/features/editor/store/editor-selectors";
import { useAppSelector, useAppStore } from "@/features/store/hooks";
import { getCurrentWorkspaceId } from "@/features/workspaces/store/workspace.thunk";
import { uploadImage } from "@/lib/upload-image";
import { useEditorActions } from "../store/editor-actions";

export function useCoverImage(noteId: string) {
  const imageSource = useAppSelector((s) => selectCoverImageSource(s, noteId));
  const store = useAppStore();
  const { setEditorCustomizations } = useEditorActions();

  const chooseNewCover = async () => {
    const embed = await uploadImage(() =>
      getCurrentWorkspaceId(store.getState),
    );
    setEditorCustomizations(noteId, { coverImageSource: embed.url });
  };

  const removeCover = () => {
    setEditorCustomizations(noteId, { coverImageSource: null });
  };

  const backgroundStyle: React.CSSProperties = imageSource
    ? {
        backgroundImage: `url(${imageSource})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }
    : {};

  return {
    imageSource,
    chooseNewCover,
    removeCover,
    backgroundStyle,
  };
}
