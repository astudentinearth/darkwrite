import { IconPlus } from "@tabler/icons-react";
import { use } from "react";
import { Button } from "@/components/ui";
import {
  selectNoteProperty,
  selectNotePropertyNames,
} from "@/features/note/store/note-selectors";
import { useAppSelector } from "@/features/store/hooks";
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
  if (!property) return null;
  return (
    <tr>
      <td>{name || "Untitled"}</td>
      <td>{property.value}</td>
    </tr>
  );
}

export function NotePropertyEditor() {
  const { noteId } = use(EditorContext);
  const properties = useAppSelector(selectNotePropertyNames(noteId));

  if (properties.length < 1) return null;

  return (
    <table>
      <tbody>
        {properties.map((p) => (
          <PropertyRow name={p} />
        ))}
        <tr>
          <td>
            <CreatePropertyDropdown>
              <Button variant="ghost" className="size-6 p-0">
                <IconPlus size={18} />
              </Button>
            </CreatePropertyDropdown>
          </td>
          <td></td>
        </tr>
      </tbody>
    </table>
  );
}
