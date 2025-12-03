import { NoteDTO } from "@/common/dto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getNoteIcon } from "@/lib/utils";
import useDeleteNote from "@/query/use-delete-note";
import { useNotes } from "@/query/use-notes";
import { useUpdateNote } from "@/query/use-update-note";
import { Trash, Undo2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { SidebarItem } from "./sidebar-item";
import { useNavigateToNote } from "@/hooks/use-navigate-to-note";

function TrashItem(props: { note: NoteDTO }) {
  const { update } = useUpdateNote();
  const deleteMutation = useDeleteNote();
  const { t } = useTranslation();
  const nav = useNavigateToNote();

  const handleDelete = () => {
    deleteMutation.mutate(props.note.id);
  };

  const handleRestore = () => {
    update({ id: props.note.id, dto: { isTrashed: false, isFavorite: false } });
  };

  return (
    <div
      tabIndex={0}
      onClick={() => nav(props.note.id)}
      className="grid grid-cols-[24px_1fr_32px_32px] gap-1 items-center px-2 py-1 rounded-lg hover:bg-secondary/20 transition-colors duration-100"
    >
      <span>{getNoteIcon(props.note.icon)}</span>
      <span className="whitespace-nowrap text-ellipsis overflow-hidden">
        {props.note.title}
      </span>
      <Button
        title={t("sidebar.trash.restore")}
        onClick={handleRestore}
        variant={"ghost"}
        className="w-8 h-8 p-0"
      >
        <Undo2 className="size-4" />
      </Button>
      <Button
        title={t("sidebar.trash.delete")}
        onClick={handleDelete}
        variant={"ghost"}
        className="w-8 h-8 p-0 text-destructive"
      >
        <Trash className="size-4" />
      </Button>
    </div>
  );
}

export function TrashWidget() {
  const { t } = useTranslation();
  const { notes } = useNotes();
  const [query, setQuery] = useState("");
  const trashedNotes = useMemo(
    () => Object.values(notes ?? {}).filter((n) => n.isTrashed),
    [notes],
  );
  const list = query
    ? trashedNotes.filter((n) => n.title.includes(query))
    : trashedNotes;
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <SidebarItem>
            <Trash size={18} />
            <span>{t("sidebar.button.trash")}</span>
          </SidebarItem>
        </PopoverTrigger>
        <PopoverContent
          side="right"
          className="w-80 ml-2 grid grid-rows-[auto_1fr] max-h-[60vh] p-0 mb-2"
        >
          <div className="p-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("sidebar.trash.search")}
              className="bg-view-2/75"
            />
          </div>
          <div className="h-full overflow-y-auto flex flex-col scroll-view px-2 pt-0 pb-2 w-full">
            {list.map((n) => (
              <TrashItem note={n} key={n.id} />
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
