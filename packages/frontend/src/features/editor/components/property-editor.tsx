import {
  type CheckboxProperty,
  type DateProperty,
  type DateRange,
  deserializeRange,
  type NoteProperty,
  PropertyType,
  serializeRange,
  type TextProperty,
} from "@darkwrite/common";
import { IconChevronRight, IconPlus, IconTrash } from "@tabler/icons-react";
import { type ReactNode, use, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  Input,
} from "@/components/ui";
import { DatePicker } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  deleteNoteProperty,
  renameNoteProperty,
  setNoteProperty,
} from "@/features/note/store/note.thunk";
import {
  selectNoteProperty,
  selectNotePropertyNames,
} from "@/features/note/store/note-selectors";
import { useAppDispatch, useAppSelector } from "@/features/store/hooks";
import { cn } from "@/lib/utils";
import { EditorContext } from "../store/editor-context";
import { selectPropertyVisibility } from "../store/editor-selectors";
import { editorActions } from "../store/editor-slice";
import { CreatePropertyDropdown } from "./create-property-dropdown";
import { PropertyIcon } from "./property-icon";

type PropertyRowProps = {
  name: string;
};

type PropertyValueFieldProps<T extends NoteProperty> = {
  property: T;
  onValueChange: (value: T) => void;
};

type PropertyContextMenuProps = {
  name: string;
  /** trigger */
  children: ReactNode;
};

function PropertyContextMenu({ name, children }: PropertyContextMenuProps) {
  const { noteId } = use(EditorContext);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const _delete = () => {
    dispatch(deleteNoteProperty(noteId, name));
  };

  return (
    <ContextMenu onOpenChange={setOpen}>
      <ContextMenuTrigger
        asChild
        className={cn(open && "bg-primary/20 rounded-md")}
      >
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem variant="destructive" onSelect={_delete}>
          <IconTrash />
          {t("note.property.action.deleteProperty")}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function TextPropertyValue({
  property,
  onValueChange,
}: PropertyValueFieldProps<TextProperty>) {
  return (
    <Input
      className="border-none rounded-none ml-px"
      value={property.value}
      onChange={(e) =>
        onValueChange({ type: PropertyType.Text, value: e.target.value })
      }
    />
  );
}

function CheckboxPropertyValue({
  onValueChange,
  property,
}: PropertyValueFieldProps<CheckboxProperty>) {
  return (
    <div className="h-full flex items-center pl-3">
      <Checkbox
        checked={property.value}
        className="border-(--dw-editor-foreground)"
        onCheckedChange={(value) =>
          onValueChange({
            type: PropertyType.Checkbox,
            value: value === true, // handle indeterminate
          })
        }
      />
    </div>
  );
}

function DatePropertyValue({
  onValueChange,
  property,
}: PropertyValueFieldProps<DateProperty>) {
  const range = deserializeRange(property.value).unwrapOr({
    from: undefined,
  } satisfies DateRange);

  const change = (value: DateRange) =>
    onValueChange({ type: PropertyType.Date, value: serializeRange(value) });

  return (
    <div className="pl-1 h-full items-center flex">
      <DatePicker
        value={range}
        className="h-fit py-1.5 px-2 bg-transparent"
        mode="multiple"
        onChange={change}
      />
    </div>
  );
}

function PropertyRow({ name }: PropertyRowProps) {
  const { noteId } = use(EditorContext);
  const property = useAppSelector((s) =>
    selectNoteProperty(s, { noteId, name }),
  );
  const dispatch = useAppDispatch();
  const properties = useAppSelector((state) =>
    selectNotePropertyNames(state, noteId),
  );

  const { t } = useTranslation();

  const [nameCollides, setNameCollides] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  if (!property) return null;

  const rename = (newName: string) => {
    if (nameCollides || newName === name) {
      if (nameRef.current) nameRef.current.value = name;
      setNameCollides(false);
      return;
    }
    dispatch(renameNoteProperty(noteId, name, newName));
  };

  const update = (prop: NoteProperty) => {
    dispatch(
      setNoteProperty(noteId, name, prop, property.type === PropertyType.Text),
    );
  };

  return (
    <tr className="border-b">
      <PropertyContextMenu name={name}>
        <td className="p-1">
          <PropertyIcon type={property.type} className="size-[18px]" />
        </td>
      </PropertyContextMenu>
      <td className="p-px flex items-center relative">
        <Input
          ref={nameRef}
          defaultValue={name}
          placeholder={t("note.property.placeholder")}
          className={cn(
            "border-none rounded-none pl-2",
            nameCollides && "bg-destructive/20",
          )}
          onBlur={(e) => rename(e.target.value)}
          onChange={(e) => {
            setNameCollides(
              name !== e.target.value && properties.includes(e.target.value),
            );
          }}
        />
      </td>
      <td className="border-l w-2/3">
        {property.type === PropertyType.Text && (
          <TextPropertyValue property={property} onValueChange={update} />
        )}
        {property.type === PropertyType.Checkbox && (
          <CheckboxPropertyValue property={property} onValueChange={update} />
        )}
        {property.type === PropertyType.Date && (
          <DatePropertyValue property={property} onValueChange={update} />
        )}
      </td>
    </tr>
  );
}

function NotePropertyEditorContent() {
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
          <PropertyRow key={p} name={p} />
        ))}
        <tr>
          <td />
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

export function NotePropertyEditor() {
  const { t } = useTranslation();
  const open = useAppSelector(selectPropertyVisibility);
  const dispatch = useAppDispatch();
  const { noteId } = use(EditorContext);
  const properties = useAppSelector((state) =>
    selectNotePropertyNames(state, noteId),
  );

  if (properties.length === 0) return null;

  const setOpen = (val: boolean) =>
    dispatch(editorActions.setPropertyVisibility(val));

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="h-fit text-xs px-1.5 py-1 gap-1 text-(--dw-editor-foreground)/70 -translate-x-2"
        >
          <IconChevronRight
            className={cn(
              "size-4 transition-transform duration-100 place-self-center",
              open && "rotate-90",
            )}
          />
          {t("note.property.showProperties")}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <NotePropertyEditorContent />
      </CollapsibleContent>
    </Collapsible>
  );
}
