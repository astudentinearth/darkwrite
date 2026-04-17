import { Button } from "@/components/ui";
import { getNoteIcon } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { navigateToNote } from "../navigation/navigator";
import useRecents from "./use-recents";
import { NoteContextMenuContainer } from "../note/note-context-menu";

export default function RecentNotes() {
  const { recents } = useRecents();
  const { t } = useTranslation();
  return (
    <div className="flex flex-col bg-view-2 top-highlight rounded-xl drop-shadow-sm drop-shadow-black/2 p-1">
      <h2 className="text-foreground text-xl p-3 tracking-tight">
        {t("home.recents")}
      </h2>
      {recents.map((note) => (
        <NoteContextMenuContainer key={note.id} noteId={note.id}>
          <Button
            className="justify-start gap-2 rounded-lg active:pushdown-99%"
            key={note.id}
            onClick={() => navigateToNote(note.id)}
            variant={"ghost"}
          >
            <span>{getNoteIcon(note.icon)}</span>
            <span>{note.title}</span>
          </Button>
        </NoteContextMenuContainer>
      ))}
    </div>
  );
}
