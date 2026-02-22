import { setEditorCustomizations } from "@/features/editor/store/editor-actions";
import { selectCoverImageSource } from "@/features/editor/store/editor-selectors";
import { useAppSelector } from "@/features/store/hooks";
import { uploadImage } from "@/lib/upload-image";

export function useCoverImage(noteId: string) {
  const imageSource = useAppSelector((s) => selectCoverImageSource(s, noteId));

  const chooseNewCover = async () => {
    const embed = await uploadImage();
    setEditorCustomizations(noteId, { coverImageSource: embed.url });
  };

  const removeCover = () => {
    setEditorCustomizations(noteId, { coverImageSource: undefined });
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
