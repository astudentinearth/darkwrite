import { NoteType } from "@darkwrite/common";
import { useNoteById } from "@/features/note/hooks/use-note-by-id";
import { useViewsOfDatabase } from "../hooks/use-views-of-database";
import { DatabaseViewRenderer } from "./database-view";

export type DatabaseEditorProps = {
  id: string;
};

export function DatabaseEditor({ id }: DatabaseEditorProps) {
  const { note } = useNoteById(id);
  const { viewIds } = useViewsOfDatabase(
    note?.type === NoteType.DatabaseView ? (note.parentId ?? "") : id,
  );

  return (
    <div className="px-3">
      <DatabaseViewRenderer views={viewIds} />
    </div>
  );
}
