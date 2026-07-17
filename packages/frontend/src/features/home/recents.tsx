import { IconEdit } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui";
import { getNoteIcon2 } from "@/lib/utils";
import { navigateToNote } from "../navigation/navigator";
import { NoteContextMenuContainer } from "../note/note-context-menu";
import { useNoteActions } from "../note/store/note-actions";
import { useCurrentWorkspaceId } from "../workspaces/hooks/use-workspace";
import useRecents from "./use-recents";

const EmptyState = () => {
  const { createNote } = useNoteActions();
  const workspaceId = useCurrentWorkspaceId();
  const { t } = useTranslation();
  return (
    <div className="border border-dashed border-secondary rounded-lg flex-col gap-3 flex justify-center py-12 items-center">
      <span>{t("home.recentsEmpty")}</span>
      <Button
        onClick={() => createNote({ workspaceId, navigateAfter: true })}
        className="h-fit"
      >
        <IconEdit size={20} />
        {t("sidebar.button.newPage")}
      </Button>
    </div>
  );
};

export default function RecentNotes() {
  const { recents } = useRecents();
  const { t } = useTranslation();
  return (
    <div className="flex flex-col bg-view-2 top-highlight rounded-xl drop-shadow-sm drop-shadow-black/2 p-1">
      <h2 className="text-foreground text-xl p-3 tracking-tight">
        {t("home.recents")}
      </h2>
      {recents.length === 0 && <EmptyState />}
      {recents.map((note) => (
        <NoteContextMenuContainer key={note.id} noteId={note.id}>
          <Button
            className="justify-start gap-2 rounded-lg active:pushdown-99%"
            key={note.id}
            onClick={() => navigateToNote(note.id)}
            variant={"ghost"}
          >
            <span>{getNoteIcon2(note.icon, note.type)}</span>
            <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-start">
              {note.title || t("defaults.pageTitle")}
            </span>
          </Button>
        </NoteContextMenuContainer>
      ))}
    </div>
  );
}
