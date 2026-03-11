import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  DialogTitle,
} from "@/components/ui";
import { getNoteIcon } from "@/lib/utils";
import { memo, useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNoteById } from "../hooks/use-note-by-id";
import { useMoveNoteDialog } from "../hooks/use-move-note-dialog";
import { useNoteActions } from "../store/note-actions";
import { useAppDispatch, useAppSelector } from "@/features/store/hooks";
import { selectNoteIcon, selectNoteTitle } from "../store/note-selectors";
import { MoveNoteDialogPortal } from "../store/notes-ui-actions";

function LocalizedTitle({ noteId }: { noteId: string }) {
  const title = useAppSelector((s) => selectNoteTitle(s, noteId));
  const icon = useAppSelector((s) => selectNoteIcon(s, noteId));

  return (
    <Trans
      i18nKey="ui.moveToDialog.title"
      components={[
        <span className="font-semibold flex items-center gap-2 p-2 bg-secondary/50 max-w-1/2 overflow-hidden text-ellipsis whitespace-nowrap rounded-md">
          <span>{getNoteIcon(icon)}</span>
          <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
            {title}
          </span>
        </span>,
      ]}
    />
  );
}

const SearchItem = memo(function ({
  noteId,
  targetNoteId,
}: {
  noteId: string;
  targetNoteId: string;
}) {
  const { note } = useNoteById(noteId);
  const { moveInto } = useNoteActions();
  const dispatch = useAppDispatch();
  if (!note) return <></>;
  return (
    <CommandItem
      className="px-2 py-4 flex items-center gap-2"
      value={note.id + " " + note.title}
      onSelect={() => {
        moveInto(targetNoteId, noteId);
        MoveNoteDialogPortal(dispatch).hideMoveNoteDialog();
      }}
    >
      <span>{getNoteIcon(note.icon)}</span>
      {note.title}
    </CommandItem>
  );
});

export default function MoveNoteDialog() {
  const { t } = useTranslation();
  const {
    hideMoveNoteDialog,
    noteId,
    open,
    setQuery,
    results,
    isLoading,
    query,
  } = useMoveNoteDialog();

  const listRef = useRef<HTMLDivElement>(null!);
  return (
    <CommandDialog
      className="max-w-120 backdrop-blur-lg"
      open={open}
      onOpenChange={(show) => {
        if (!show) {
          setQuery("");
          hideMoveNoteDialog();
        }
      }}
    >
      <DialogTitle className="flex gap-2 pl-4 pt-2 items-center font-semibold">
        {noteId && <LocalizedTitle noteId={noteId} />}
      </DialogTitle>
      <CommandInput
        placeholder={t("search.placeholder")}
        value={query}
        onValueChange={(val) => {
          setQuery(val);
          listRef.current.scrollTo(0, 0);
        }}
      />
      <CommandList ref={listRef} className="scroll-view">
        <CommandEmpty>{t("search.noResult")}</CommandEmpty>
        <CommandGroup>
          {noteId &&
            results.map((id) => (
              <SearchItem key={id} noteId={id} targetNoteId={noteId} />
            ))}
          {isLoading && "Loading"}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
