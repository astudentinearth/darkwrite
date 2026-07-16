import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui";
import { useAvailableDatabases } from "../hooks/use-databases-in-workspace";
import { useMemo, useState } from "react";
import { useNoteById } from "@/features/note/hooks/use-note-by-id";
import { cn, getNoteIcon2 } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export type DatabasePickerProps = React.ComponentProps<typeof Select> & {
  className?: string;
};

const PickerItem = (props: { id: string }) => {
  const { note } = useNoteById(props.id);
  if (!note) return null;
  return (
    <SelectItem value={props.id}>
      <span>{getNoteIcon2(note.icon, note.type)}</span>
      {note.title}
    </SelectItem>
  );
};

export function DatabasePicker({
  className,
  onValueChange,
  ...props
}: DatabasePickerProps) {
  const { databaseIds } = useAvailableDatabases();
  const { note: selected } = useNoteById(props.value);
  const { t } = useTranslation();

  const items = useMemo(
    () => databaseIds.map((id) => <PickerItem key={id} id={id} />),
    [databaseIds],
  );

  return (
    <Select {...props} onValueChange={onValueChange}>
      <SelectTrigger className={cn("", className)}>
        {selected ? (
          <div className={"flex gap-1.5 items-center"}>
            <span>{getNoteIcon2(selected.icon, selected.type)}</span>
            {selected.title}
          </div>
        ) : (
          t("editor.database.picker.placeholder")
        )}
      </SelectTrigger>
      <SelectContent>{items}</SelectContent>
    </Select>
  );
}
