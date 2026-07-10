import { useGetNotesByParentIdQuery } from "@/features/note/store/notes-api";
import { useCurrentWorkspaceId } from "@/features/workspaces/hooks/use-workspace";
import { useViewsById } from "../hooks/use-views-by-id";
import { useViewsOfDatabase } from "../hooks/use-views-of-database";
import { DatabaseViewRenderer } from "./database-view";
import { useNoteById } from "@/features/note/hooks/use-note-by-id";
import { NoteType } from "@darkwrite/common";

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
