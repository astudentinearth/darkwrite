import {
  Button,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";
import { useNoteActions } from "@/features/note/store/note-actions";
import { cn } from "@/lib/utils";
import { DatabaseViewType, type NoteDTO } from "@darkwrite/common";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DatabasePicker } from "./database-picker";

export type NewDatabaseViewPopoverProps = {
  defaultDatabaseId?: string;
  className?: string;
  onCreate?: (note: NoteDTO) => void;
};

export function NewDatabaseViewPopover(props: NewDatabaseViewPopoverProps) {
  const [title, setTitle] = useState("");
  const [type] = useState<DatabaseViewType>(DatabaseViewType.Table);
  const [databaseId, setDatabaseId] = useState(props.defaultDatabaseId);
  const [open, setOpen] = useState(false);
  const [working, setWorking] = useState(false);
  const { t } = useTranslation();
  const actions = useNoteActions();

  const create = () => {
    if (!databaseId) return;
    setWorking(true);
    actions
      .createDatabaseView({ databaseId, type, title })
      .then(({ data }) => {
        if (!data) return;
        setTitle("");
        setOpen(false);
        props.onCreate?.(data.note);
      })
      .finally(() => setWorking(false));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-fit h-fit p-2",
            open && "bg-secondary/40",
            props.className,
          )}
        >
          <IconPlus size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-1 flex flex-col gap-2">
        <Label htmlFor="new-view-title" className="p-2">
          {t("editor.database.newView.titleLabel")}
        </Label>
        <Input
          id="new-view-title"
          placeholder={t("defaults.pageTitle")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Label className="p-2">{t("editor.database.newView.dataSource")}</Label>
        <DatabasePicker
          value={databaseId ?? props.defaultDatabaseId}
          onValueChange={setDatabaseId}
        />
        <div className="flex gap-2 *:w-1/2 *:px-2 *:py-1.5 *:h-fit">
          <Button
            variant="secondary"
            onClick={() => {
              setOpen(false);
              setTitle("");
            }}
          >
            {t("editor.database.newView.cancel")}
          </Button>
          <Button disabled={working} onClick={create}>
            {t("editor.database.newView.create")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
