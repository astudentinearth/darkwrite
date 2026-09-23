import { isDescendant } from "@darkwrite/common";
import { memo, useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui";
import { useAppDispatch, useAppSelector } from "@/features/store/hooks";
import { getNoteIcon } from "@/lib/utils";
import { useMoveNoteDialogState } from "../hooks/use-move-note-dialog";
import { useNoteById } from "../hooks/use-note-by-id";
import { moveFailToast, moveSuccessToast } from "../note.toast";
import { moveNote } from "../store/note.thunk";
import {
  searchCurrentWorkspace,
  selectAllNotesAsMap,
  selectNoteIcon,
  selectNoteTitle,
} from "../store/note-selectors";
import { MoveNoteDialogPortal } from "../store/notes-ui-actions";

function LocalizedTitle({ noteId }: { noteId: string }) {
  const title = useAppSelector((s) => selectNoteTitle(s, noteId));
  const icon = useAppSelector((s) => selectNoteIcon(s, noteId));

  return (
    <Trans
      i18nKey="ui.moveToDialog.title"
      components={[
        <span className="font-semibold flex items-center gap-1 px-2 py-0.5 bg-secondary/50 max-w-1/2 overflow-hidden text-ellipsis whitespace-nowrap rounded-md">
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
  /** the note we are moving **into** */
  noteId: string;
  /** the note we are moving */
  targetNoteId: string;
}) {
  const { note } = useNoteById(noteId);
  const dispatch = useAppDispatch();
  if (!note) return <></>;
  return (
    <CommandItem
      className="px-2 py-1.5 flex items-center gap-2 rounded-lg"
      value={`${note.id} ${note.title}`}
      onSelect={() => {
        dispatch(moveNote(targetNoteId, noteId))
          .andTee(moveSuccessToast)
          .orTee(moveFailToast);
        MoveNoteDialogPortal(dispatch).hideMoveNoteDialog();
      }}
    >
      <span>{getNoteIcon(note.icon)}</span>
      {note.title}
    </CommandItem>
  );
});

function Results() {
  const { query, noteId: src } = useMoveNoteDialogState();
  const results = useAppSelector((s) =>
    src
      ? searchCurrentWorkspace(s, query).filter(
          (dest) =>
            dest !== src && !isDescendant(dest, src, selectAllNotesAsMap(s)),
        )
      : [],
  );
  if (!src) return null;
  return results.map((id) => (
    <SearchItem noteId={id} targetNoteId={src} key={id} />
  ));
}

export default function MoveNoteDialog() {
  const { t } = useTranslation();
  const { noteId, open, query, setQuery, hideMoveNoteDialog } =
    useMoveNoteDialogState();

  // biome-ignore lint/style/noNonNullAssertion: ref is always set
  const listRef = useRef<HTMLDivElement>(null!);
  return (
    <Dialog
      open={open}
      onOpenChange={(show) => {
        if (!show) {
          setQuery("");
          hideMoveNoteDialog();
        }
      }}
    >
      <DialogContent
        noOverlay
        className="max-w-120 bg-view-1/80 backdrop-blur-lg p-0 origin-top top-16 translate-y-0 drop-shadow-2xl"
      >
        <DialogTitle className="flex gap-2 pl-3 pt-2 items-center text-base font-semibold">
          {noteId && <LocalizedTitle noteId={noteId} />}
        </DialogTitle>
        <Command onKeyDown={(e) => e.stopPropagation()}>
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
              <Results />
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
