import DynamicTextarea from "@/components/dynamic-textarea";
import { EmojiPicker } from "@/components/emoji-picker";
import { Button } from "@/components/ui";
import useMouseOver from "@/hooks/layout/use-mouse-over";
import { cn, fromUnicode } from "@/lib/utils";
import { Frown, Image, Smile } from "lucide-react";
import { useTranslation } from "react-i18next";
import ConstrainedWidth from "./constrained-width";
import CoverImage from "./cover-image";

export type EditorHeaderProps = {
  title: string;
  onTitleChange: (val: string) => void;
  icon: string | undefined | null;
  onIconChange: (val: string | undefined | null) => void;
  coverImageSource?: string;
  onCoverSourceChange: (val: string | undefined | null) => void;
  onAddCover: () => void;
  wide?: boolean;
};

export default function EditorHeader(props: EditorHeaderProps) {
  const { t } = useTranslation();
  const mouseOver = useMouseOver();
  return (
    <div
      className={cn(
        "w-full flex flex-col items-center pt-24",
        props.coverImageSource && "pt-48",
      )}
      {...mouseOver.hoverProps}
    >
      <CoverImage
        onImageSourceChange={props.onCoverSourceChange}
        imageSource={props.coverImageSource}
        onAddCover={props.onAddCover}
      />
      <ConstrainedWidth
        className={cn("flex flex-col gap-2 px-4 pt-2")}
        fill={props.wide}
      >
        <div className="flex gap-2 items-end mb-4 font-ui">
          {props.icon && (
            <EmojiPicker
              show={fromUnicode(props.icon ?? "")}
              closeOnSelect
              onSelect={props.onIconChange}
              className={cn(
                "z-50 -translate-x-2",
                props.coverImageSource && "-mt-8",
              )}
            />
          )}
          <div
            className={cn(
              "opacity-0 z-20 font-ui -translate-x-3",
              mouseOver.mouseOver && "opacity-100",
            )}
          >
            {!props.icon && (
              <>
                <Button
                  onClick={() => props.onIconChange("1f4c4")}
                  className="w-fit"
                  variant={"ghost"}
                >
                  <Smile size={18} />
                  {t("editor.cover.addIcon")}
                </Button>
              </>
            )}
            {props.icon && (
              <Button
                onClick={() => props.onIconChange(null)}
                className="w-fit"
                variant={"ghost"}
              >
                <Frown size={18} />
                {t("editor.cover.removeIcon")}
              </Button>
            )}
            {!props.coverImageSource && (
              <Button
                onClick={props.onAddCover}
                className="w-fit"
                variant={"ghost"}
              >
                <Image size={18} />
                {t("editor.cover.addCover")}
              </Button>
            )}
          </div>
        </div>

        <DynamicTextarea
          className="text-4xl font-semibold box-border h-auto overflow-hidden resize-none grow outline-hidden block"
          defaultValue={props.title}
          onValueChange={props.onTitleChange}
        />
        <hr />
      </ConstrainedWidth>
    </div>
  );
}
