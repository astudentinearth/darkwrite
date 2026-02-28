import { EmojiPicker } from "@/components/emoji-picker";
import { Button } from "@/components/ui";
import { AddRemoveIconButton } from "@/features/editor/components/add-remove-icon";
import useEditorCover from "@/features/editor/hooks/use-editor-cover";
import { EditorContext } from "@/features/editor/store/editor-context";
import useMouseOver from "@/hooks/layout/use-mouse-over";
import { cn, fromUnicode } from "@/lib/utils";
import { Image } from "lucide-react";
import { use } from "react";
import { useTranslation } from "react-i18next";
import { TitleEditField } from "./components/title-edit-field";
import ConstrainedWidth from "./constrained-width";
import CoverImage from "./cover-image";
import TrashBanner from "./components/trash-banner";

export type EditorHeaderProps = {
  noteId: string;
};

export default function EditorHeader() {
  const { t } = useTranslation();
  const { noteId } = use(EditorContext);
  const { addCover, updateIcon, hasCover, wide, icon } = useEditorCover(noteId);

  const mouseOver = useMouseOver();
  return (
    <div
      className={cn(
        "w-full flex flex-col items-center pt-24",
        hasCover && "pt-48",
      )}
      {...mouseOver.hoverProps}
    >
      <CoverImage />
      <ConstrainedWidth
        className={cn("flex flex-col gap-2 px-4 pt-2")}
        fill={wide}
      >
        <div className="flex gap-2 items-end mb-4 font-ui">
          {icon && (
            <EmojiPicker
              show={fromUnicode(icon ?? "")}
              closeOnSelect
              onSelect={updateIcon}
              className={cn("z-50 -translate-x-2", hasCover && "-mt-8")}
            />
          )}
          <div
            className={cn(
              "opacity-0 z-20 font-ui -translate-x-3",
              mouseOver.mouseOver && "opacity-100",
            )}
          >
            <AddRemoveIconButton />
            {!hasCover && (
              <Button onClick={addCover} className="w-fit" variant={"ghost"}>
                <Image size={18} />
                {t("editor.cover.addCover")}
              </Button>
            )}
          </div>
        </div>

        <TitleEditField />
        <TrashBanner />
        <hr />
      </ConstrainedWidth>
    </div>
  );
}
