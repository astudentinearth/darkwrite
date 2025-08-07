import { useNotes } from "@/query/use-notes";
import { LexoRank } from "lexorank";
import { ReactNode, useMemo } from "react";
import NoteDropZone from "../note/note-drop-zone";
import NoteHeader from "../note/note-header";
import { NoteContextMenuContainer } from "../note/note-context-menu";

export default function FavoriteNoteList() {
  const { notes, nextFavoriteHint } = useNotes();
  const favorites = useMemo(
    () =>
      notes
        ?.filter((n) => n.isFavorite && !n.isTrashed)
        .toSorted((a, b) =>
          a.favoriteOrderHint.localeCompare(b.favoriteOrderHint),
        ),
    [notes],
  );
  if (!favorites || favorites.length < 1 || !nextFavoriteHint) return <div></div>;

  const leadingHint = LexoRank.parse(favorites[0].favoriteOrderHint)
    .genPrev()
    .toString();

  const render = () => {
    const nodes: ReactNode[] = [];
    nodes.push(
      <NoteDropZone
        orderHint={leadingHint}
        key="dropzone-leading"
        orderingKey="favoriteOrderHint"
      />,
    );
    for (let i = 0; i < favorites.length; i++) {
      const note = favorites[i];
      const item = (
        <NoteContextMenuContainer note={note}>
          <NoteHeader showCreate={false} collapsible={false} note={note} />
        </NoteContextMenuContainer>
      );
      nodes.push(item);

      if (i === favorites.length - 1) {
        nodes.push(
          <NoteDropZone
            key={`dropzone-${nextFavoriteHint}`}
            orderHint={nextFavoriteHint}
            orderingKey="favoriteOrderHint"
          />,
        );
        break;
      }

      const currentHint = LexoRank.parse(note.favoriteOrderHint);
      const nextHint = LexoRank.parse(favorites[i + 1].favoriteOrderHint);
      const between = currentHint.between(nextHint);
      const drop = (
        <NoteDropZone
          orderHint={between.toString()}
          orderingKey="favoriteOrderHint"
          key={`dropzone-${between.toString()}`}
        />
      );
      nodes.push(drop);
    }
    return nodes;
  };

  return <>{render()}</>;
}
