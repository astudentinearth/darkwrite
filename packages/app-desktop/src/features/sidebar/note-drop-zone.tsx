import {
  useNotesQuery,
  useUpdateMultipleNotesMutation,
} from "@renderer/hooks/query";
import { cn } from "@renderer/lib/utils";
import { produce } from "immer";
import { DragEvent, useState } from "react";
export function NoteDropZone({
  parentID,
  belowID,
  last,
}: {
  parentID?: string | null;
  belowID?: string;
  last?: boolean;
}) {
  const [dragOver, setDragOver] = useState(false);
  const saveAllMutation = useUpdateMultipleNotesMutation();
  const notesQuery = useNotesQuery();
  const notes = notesQuery.data;
  const handleDrop = async (event: DragEvent<HTMLElement>) => {
    if (!notes) return;
    event.preventDefault();
    event.stopPropagation();
    const data = event.dataTransfer.getData("note_id");
    setDragOver(false);
    // we will mutate the list on the client side first
    const updated = produce(notes, (arr) => {
      const belowIndex = arr.findIndex((n) => n.id === belowID); // find note below this drop zone
      const noteIndex = arr.findIndex((n) => n.id === data); // find original
      const note = arr[noteIndex];
      note.parentId = parentID ?? undefined;
      // move notes around
      if (last) {
        arr.splice(noteIndex, 1); // remove original
        arr.push(note); // send to the end
      } else {
        if (belowIndex > noteIndex) {
          // account for the removed item
          arr.splice(belowIndex - 1, 0, arr.splice(noteIndex, 1)[0]); // move original just before below
        } else {
          arr.splice(belowIndex, 0, arr.splice(noteIndex, 1)[0]); // move original just before below
        }
      }
      // reindex
      for (let i = 0; i < arr.length; i++) {
        console.log("Indexed", arr[i].title, "as", i);
        arr[i].index = i;
      }
    });
    saveAllMutation.mutate(updated); // update
  };

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    if (!notes) return;
    event.preventDefault();
    event.stopPropagation();
    //const below = notes.find((n) => n.id === belowID);
    //console.log(below?.title);
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };
  const handleDragEnd = () => {
    setDragOver(false);
  };
  return (
    <div
      className={cn(
        "h-[3px] w-full bg-transparent transition-colors rounded-md",
        dragOver && "bg-primary",
      )}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    ></div>
  );
}
