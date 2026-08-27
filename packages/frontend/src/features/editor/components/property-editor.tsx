import { IconPlus } from "@tabler/icons-react";
import { use, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Input } from "@/components/ui";
import { renameNoteProperty } from "@/features/note/store/note.thunk";
import {
  selectNoteProperty,
  selectNotePropertyNames,
} from "@/features/note/store/note-selectors";
import { useAppDispatch, useAppSelector } from "@/features/store/hooks";
import { cn } from "@/lib/utils";
import { EditorContext } from "../store/editor-context";
import { CreatePropertyDropdown } from "./create-property-dropdown";

type PropertyRowProps = {
  name: string;
};

function PropertyRow({ name }: PropertyRowProps) {
  const { noteId } = use(EditorContext);
  const property = useAppSelector((s) =>
    selectNoteProperty(s, { noteId, name }),
  );
  const dispatch = useAppDispatch();
  const properties = useAppSelector((state) =>
    selectNotePropertyNames(state, noteId),
  );

  const [nameCollides, setNameCollides] = useState(false);

  if (!property) return null;

  const rename = (newName: string) => {
    if (properties.includes(newName)) return;
    dispatch(renameNoteProperty(noteId, name, newName));
  };

  return (
    <tr className="border-b">
      <td className="p-px">
        <Input
          defaultValue={name}
          className={cn(
            "border-transparent rounded-none",
            nameCollides && "border-destructive",
          )}
          onBlur={(e) => rename(e.target.value)}
          onChange={(e) => {
            setNameCollides(
              name !== e.target.value && properties.includes(e.target.value),
            );
          }}
        />
      </td>
      <td className="border-l">{property.value}</td>
    </tr>
  );
}

export function NotePropertyEditor() {
  const { noteId } = use(EditorContext);
  const properties = useAppSelector((state) =>
    selectNotePropertyNames(state, noteId),
  );
  const { t } = useTranslation();

  if (properties.length < 1) return null;

  return (
    <table>
      <tbody>
        {properties.map((p) => (
          <PropertyRow name={p} />
        ))}
        <tr>
          <td className="pt-2 px-1">
            <CreatePropertyDropdown>
              <Button
                variant="ghost"
                className="h-fit w-fit p-1 text-muted-foreground"
              >
                <IconPlus size={18} />
                {t("note.property.action.addProperty")}
              </Button>
            </CreatePropertyDropdown>
          </td>
          <td></td>
        </tr>
      </tbody>
    </table>
  );
}
