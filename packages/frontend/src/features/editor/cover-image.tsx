import { use } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useCoverImage } from "@/features/editor/hooks/use-cover-image";
import { EditorContext } from "@/features/editor/store/editor-context";
import { cn } from "@/lib/utils";

export default function CoverImage() {
  const { noteId } = use(EditorContext);
  const { chooseNewCover, imageSource, removeCover, backgroundStyle } =
    useCoverImage(noteId);
  const { t } = useTranslation("translation", { keyPrefix: "editor.cover" });

  if (!imageSource) return <></>;

  return (
    <div
      className={cn(
        "w-full h-48 shrink-0 select-none flex items-end group/cover justify-end p-2 gap-2 absolute top-0 left-0 right-0 font-ui",
        !imageSource && "h-24",
      )}
      style={backgroundStyle}
    >
      <Button
        onClick={removeCover}
        variant={"secondary"}
        className={cn(
          "bg-secondary/80 backdrop-blur-lg opacity-0 group-hover/cover:opacity-100 group-focus-within/cover:opacity-100 transition-opacity hover:bg-secondary! drop-shadow-md h-fit px-2 py-2",
        )}
      >
        {t("removeCover")}
      </Button>
      <Button
        onClick={chooseNewCover}
        variant={"secondary"}
        className={cn(
          "bg-secondary/80 backdrop-blur-lg opacity-0 group-hover/cover:opacity-100 group-focus-within/cover:opacity-100 transition-opacity hover:bg-secondary! drop-shadow-md h-fit px-2 py-2",
        )}
      >
        {t("changeCover")}
      </Button>
    </div>
  );
}
