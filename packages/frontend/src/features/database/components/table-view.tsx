import { use } from "react";
import { DatabaseViewContext } from "../store/database-view-context";
import { useNotesInDatabase } from "../hooks/use-notes-in-database";
import { useNoteById } from "@/features/note/hooks/use-note-by-id";
import { getNoteIcon2 } from "@/lib/utils";
import { Button } from "@/components/ui";
import { useEditorActions } from "@/features/editor/store/editor-actions";
import { GalleryVertical } from "lucide-react";

function TableItem({id}: {id: string}) {
  
  const {note} = useNoteById(id);
  const {showCenterView} = useEditorActions();

  if(!note) return null;

  return (
    <tr className={"border-b *:py-1.5 hover:bg-secondary/20"}>
      <td className={"grid grid-cols-[24px_1fr_auto] gap-2 place-items-center"}>
        <span>{getNoteIcon2(note.icon, note.type)}</span>
        <span className="text-start justify-self-start">{note.title}</span>
        <Button onClick={() => showCenterView(id)} variant="secondary" className="px-1.5 py-1 h-fit w-fit">
        <GalleryVertical size={16}/>
        Open</Button>
      </td>
    </tr>
  )
}

export function TableView() {
  const context = use(DatabaseViewContext);
  
  const {noteIds} = useNotesInDatabase(context.databaseId);

  return <div className="w-full">
    <table className="w-full">
    <thead>
      <tr className="text-start *:text-start *:py-1.5 border-b">
        <th>Title</th>
      </tr>
      </thead>
      <tbody>
      {
        noteIds.map(id => <TableItem key={id} id={id} />)
      }
      </tbody>
    </table>
  </div>
}

