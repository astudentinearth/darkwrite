import { selectCoverImageSource } from "@/features/editor/store/editor-selectors";
import { useAppSelector } from "@/features/store/hooks";
import { uploadImage } from "@/lib/upload-image";
import { useEditorActions } from "../store/editor-actions";
import { useWorkspaceActions } from "@/features/workspaces/store/workspace-actions";

export function useCoverImage(noteId: string) {
  const imageSource = useAppSelector((s) => selectCoverImageSource(s, noteId));
  const { getCurrentWorkspaceId } = useWorkspaceActions();
  const { setEditorCustomizations } = useEditorActions();

  const chooseNewCover = async () => {
    const embed = await uploadImage(getCurrentWorkspaceId);
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
