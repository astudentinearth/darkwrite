import { Button } from "@/components/ui/button";
import useMouseOver from "@/hooks/layout/use-mouse-over";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export type CoverImageProps = {
  imageSource?: string;
  onImageSourceChange: (src: string | undefined) => void;
};

export default function CoverImage(props: CoverImageProps) {
  const { hoverProps, mouseOver } = useMouseOver();
  const {t} = useTranslation("translation", {keyPrefix: "editor.cover"})
  return (
    <div
      {...hoverProps}
      className={cn("w-full h-40 shrink-0 flex items-end justify-end p-2 gap-2")}
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
      <Button variant={"outline"} className={cn(!mouseOver && "hidden")}>{t("changeCover")}</Button>
      <Button variant={"outline"} className={cn(!mouseOver && "hidden")}>{t("removeCover")}</Button>
    </div>
  );
}
