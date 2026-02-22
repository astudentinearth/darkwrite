import DynamicTextarea from "@/components/dynamic-textarea";
import { EmojiPicker } from "@/components/emoji-picker";
import { Button } from "@/components/ui";
import useMouseOver from "@/hooks/layout/use-mouse-over";
import { cn, fromUnicode } from "@/lib/utils";
import { Frown, Image, Smile, Undo2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import ConstrainedWidth from "./constrained-width";
import CoverImage from "./cover-image";
import Alert from "@/components/ui/alert";
import { useEditorStore } from "@/context/editor-store";
import { UtilityNodes } from "./node-types";
import useEditorCover from "@/features/editor/hooks/use-editor-cover";
import { use } from "react";
import { EditorContext } from "@/features/editor/store/editor-context";
import { AddRemoveIconButton } from "@/features/editor/components/add-remove-icon";

export type EditorHeaderProps = {
  noteId: string;
};

export default function EditorHeader() {
  const { t } = useTranslation();
  const { noteId } = use(EditorContext);
  const { addCover, updateIcon, hasCover, updateTitle, wide, icon, title } =
    useEditorCover(noteId);

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
            {hasCover && (
              <Button onClick={addCover} className="w-fit" variant={"ghost"}>
                <Image size={18} />
                {t("editor.cover.addCover")}
              </Button>
            )}
          </div>
        </div>

        <DynamicTextarea
          className="text-4xl font-semibold box-border h-auto overflow-hidden resize-none grow outline-hidden block"
          defaultValue={title}
          preventNewline
          onKeyDown={(e) => {
            if (e.key === "Enter")
              useEditorStore
                .getState()
                .editor?.chain()
                .insertContentAt(0, UtilityNodes.EmptyParagraph)
                .focus()
                .run();
          }}
          onValueChange={(val) =>
            updateTitle(val.replace(/(\r\n|\n|\r)/gm, " "))
          }
        />

        {props.isTrashed && (
          <Alert>
            {t("editor.cover.trashWarning")}
            <Button
              onClick={props.onRestore}
              variant={"secondary"}
              className="w-fit"
            >
              <Undo2 className="size-4" />
              {t("sidebar.trash.restore")}
            </Button>
          </Alert>
        )}
        <hr />
      </ConstrainedWidth>
    </div>
  );
}
