import { GalleryVertical, TextAlignStart } from "lucide-react";
import { use, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui";
import { useEditorActions } from "@/features/editor/store/editor-actions";
import { useNoteById } from "@/features/note/hooks/use-note-by-id";
import { NoteContextMenuContainer } from "@/features/note/note-context-menu";
import { useNoteActions } from "@/features/note/store/note-actions";
import { useTitleUpdater } from "@/features/note/store/update-note";
import { getNoteIcon2 } from "@/lib/utils";
import { useNotesInDatabase } from "../hooks/use-notes-in-database";
import { DatabaseViewContext } from "../store/database-view-context";
import { TextTableCell } from "./text-table-cell";

function TableItem({ id }: { id: string }) {
  const { note } = useNoteById(id);
  const { showCenterView } = useEditorActions();
  const { t } = useTranslation();
  const titleUpdater = useTitleUpdater(id);
  if (!note) return null;

  return (
    <NoteContextMenuContainer noteId={id}>
      <tr
        className={"border-b min-h-16 rounded-2xl hover:bg-secondary/20 group"}
      >
        <TextTableCell
          defaultValue={note.title}
          onValueChange={(val) => {
            titleUpdater.update(val);
          }}
          placeholder={t("defaults.pageTitle")}
          className={"grid  grid-cols-[24px_1fr_auto] gap-2 place-items-center"}
        >
          <span>{getNoteIcon2(note.icon, note.type)}</span>
          <span className="text-start justify-self-start">
            {note.title || t("defaults.pageTitle")}
          </span>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              showCenterView(id);
            }}
            variant="secondary"
            className="px-1.5 py-1 h-fit w-fit group-hover:opacity-100 focus:opacity-100 opacity-0"
          >
            <GalleryVertical size={16} />
            Open
          </Button>
        </TextTableCell>
      </tr>
    </NoteContextMenuContainer>
  );
}

export function TableView() {
  const context = use(DatabaseViewContext);

  const { noteIds } = useNotesInDatabase(context.databaseId);

  return (
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr className="text-start *:text-start *:py-1.5 border-b *:px-2">
            <th className="flex items-center gap-2 select-none hover:bg-secondary/50">
              <TextAlignStart size={18} /> Title
            </th>
          </tr>
        </thead>
        <tbody>
          {noteIds.map((id) => (
            <TableItem key={id} id={id} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
