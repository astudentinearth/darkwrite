import { IconTextPlus } from "@tabler/icons-react";
import { Image } from "lucide-react";
import { use } from "react";
import { useTranslation } from "react-i18next";
import { EmojiPicker } from "@/components/emoji-picker";
import { Button } from "@/components/ui";
import { AddRemoveIconButton } from "@/features/editor/components/add-remove-icon";
import useEditorCover from "@/features/editor/hooks/use-editor-cover";
import { EditorContext } from "@/features/editor/store/editor-context";
import useMouseOver from "@/features/ui/hooks/use-mouse-over";
import { cn, fromUnicode } from "@/lib/utils";
import { selectNotePropertyNames } from "../note/store/note-selectors";
import { useAppSelector } from "../store/hooks";
import { CreatePropertyDropdown } from "./components/create-property-dropdown";
import { NotePropertyEditor } from "./components/property-editor";
import { TitleEditField } from "./components/title-edit-field";
import TrashBanner from "./components/trash-banner";
import ConstrainedWidth from "./constrained-width";
import CoverImage from "./cover-image";

function AddPropertyButton() {
  const { noteId } = use(EditorContext);
  const { t } = useTranslation();
  const properties = useAppSelector((state) =>
    selectNotePropertyNames(state, noteId),
  );
  if (properties.length > 0) return null;

  return (
    <CreatePropertyDropdown>
      <Button className="w-fit" variant="ghost">
        <IconTextPlus size={18} />
        {t("note.property.action.addProperty")}
      </Button>
    </CreatePropertyDropdown>
  );
}

export function NoteMetadataEditors({ mouseOver }: { mouseOver?: boolean }) {
  const { t } = useTranslation();
  const { noteId } = use(EditorContext);
  const { addCover, updateIcon, hasCover, icon } = useEditorCover(noteId);

  return (
    <>
      <div className="flex gap-2 items-end mb-4 font-ui">
        {icon && (
          <EmojiPicker
            show={fromUnicode(icon ?? "")}
            closeOnSelect
            onSelect={updateIcon}
            className={cn("z-30 -translate-x-1", hasCover && "-mt-8")}
          />
        )}
        <div
          className={cn(
            "opacity-0 z-20 font-ui -translate-x-3",
            mouseOver && "opacity-100",
          )}
        >
          <AddRemoveIconButton />
          {!hasCover && (
            <Button onClick={addCover} className="w-fit" variant={"ghost"}>
              <Image size={18} />
              {t("editor.cover.addCover")}
            </Button>
          )}
          <AddPropertyButton />
        </div>
      </div>

      <TitleEditField />
    </>
  );
}

export default function EditorHeader({
  alwaysFill,
  className,
}: {
  alwaysFill?: boolean;
  className?: string;
}) {
  const { noteId } = use(EditorContext);
  const { hasCover, wide } = useEditorCover(noteId);

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
        className={cn("flex flex-col w-full gap-2 px-4 pt-2", className)}
        fill={wide}
        noConstrain={alwaysFill}
      >
        <NoteMetadataEditors mouseOver={mouseOver.mouseOver} />
        <NotePropertyEditor />
        <TrashBanner />
        <hr />
      </ConstrainedWidth>
    </div>
  );
}
