import { Button } from "@/components/ui/button";
import useMouseOver from "@/hooks/layout/use-mouse-over";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export type CoverImageProps = {
  imageSource?: string;
  onImageSourceChange: (src: string | undefined | null) => void;
  onAddCover: () => void;
};

export default function CoverImage(props: CoverImageProps) {
  const { hoverProps, mouseOver } = useMouseOver();
  const { t } = useTranslation("translation", { keyPrefix: "editor.cover" });

  return (
    <div
      {...hoverProps}
      className={cn(
        "w-full h-48 shrink-0 flex items-end justify-end p-2 gap-2 absolute top-0 left-0 right-0",
        !props.imageSource && "h-24"
      )}
      style={
        props.imageSource
          ? {
              backgroundImage: `url(${props.imageSource})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }
          : {}
      }
    >
      {props.imageSource && (
        <>
          <Button
            onClick={()=>{
              props.onImageSourceChange(null);
            }}
            variant={"outline"}
            className={cn("bg-view-1 drop-shadow-sm", !mouseOver && "hidden")}
          >
            {t("removeCover")}
          </Button>
          <Button
            variant={"outline"}
            className={cn("bg-view-1 drop-shadow-sm", !mouseOver && "hidden")}
            onClick={props.onAddCover}
          >
            {t("changeCover")}
          </Button>
        </>
      )}
    </div>
  );
}
