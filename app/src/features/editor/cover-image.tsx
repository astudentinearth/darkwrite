import { Button } from "@/components/ui/button";
import { useCoverImage } from "@/features/editor/hooks/use-cover-image";
import { EditorContext } from "@/features/editor/store/editor-context";
import useMouseOver from "@/features/ui/hooks/use-mouse-over";
import { cn } from "@/lib/utils";
import { use } from "react";
import { useTranslation } from "react-i18next";

export default function CoverImage() {
  const { hoverProps, mouseOver } = useMouseOver();
  const { noteId } = use(EditorContext);
  const { chooseNewCover, imageSource, removeCover, backgroundStyle } =
    useCoverImage(noteId);
  const { t } = useTranslation("translation", { keyPrefix: "editor.cover" });

  if (!imageSource) return <></>;

  return (
    <div
      {...hoverProps}
      className={cn(
        "w-full h-48 shrink-0 flex items-end justify-end p-2 gap-2 absolute top-0 left-0 right-0 font-ui",
        !imageSource && "h-24",
      )}
      style={backgroundStyle}
    >
      <Button
        onClick={removeCover}
        variant={"secondary"}
        className={cn(
          "bg-view-1 hover:bg-secondary! drop-shadow-md",
          !mouseOver && "hidden",
        )}
      >
        {t("removeCover")}
      </Button>
      <Button
        onClick={chooseNewCover}
        variant={"secondary"}
        className={cn(
          "bg-view-1 hover:bg-secondary! drop-shadow-md",
          !mouseOver && "hidden",
        )}
      >
        {t("changeCover")}
      </Button>
    </div>
  );
}
