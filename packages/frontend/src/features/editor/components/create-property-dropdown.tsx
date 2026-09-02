import { getDefaultNoteProperty, PropertyType } from "@darkwrite/common";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
  IconAlignJustified,
  IconCalendar,
  IconCheckbox,
} from "@tabler/icons-react";
import { type ReactNode, use } from "react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui";
import { setNoteProperty } from "@/features/note/store/note.thunk";
import { useAppDispatch } from "@/features/store/hooks";
import { EditorContext } from "../store/editor-context";
import { editorActions } from "../store/editor-slice";

export function CreatePropertyDropdown({ children }: { children: ReactNode }) {
  const { noteId } = use(EditorContext);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const addProp = (type: PropertyType) => () => {
    dispatch(setNoteProperty(noteId, "", getDefaultNoteProperty(type))).map(
      () => {
        dispatch(editorActions.setPropertyVisibility(true)); // auto expand properties
      },
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={addProp(PropertyType.Text)}>
          <IconAlignJustified size={18} />
          <span>{t("note.property.type.text")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={addProp(PropertyType.Date)}>
          <IconCalendar size={18} />
          <span>{t("note.property.type.date")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={addProp(PropertyType.Checkbox)}>
          <IconCheckbox size={18} />
          <span>{t("note.property.type.checkbox")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
