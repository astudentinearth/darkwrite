import { Rank } from "@/common/rank";
import { useNotes } from "@/query/use-notes";
import { ReactNode, useMemo } from "react";
import { NoteContextMenuContainer } from "../note/note-context-menu";
import NoteDropZone from "../note/note-drop-zone";
import NoteHeader from "../note/note-header";

export default function FavoriteNoteList() {
  const { notes, nextFavoriteHint } = useNotes();
  const favorites = useMemo(
    () =>
      Object.values(notes ?? {})
        .filter((n) => n.isFavorite && !n.isTrashed)
        .toSorted((a, b) =>
          Rank.sorter(a.favoriteOrderHint, b.favoriteOrderHint)
        ),
    [notes],
  );
  if (!favorites || favorites.length < 1 || !nextFavoriteHint)
    return <div></div>;

  const leadingHint = new Rank(favorites[0].favoriteOrderHint)
    .prev()
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

      const currentHint = new Rank(note.favoriteOrderHint);
      const nextHint = new Rank(favorites[i + 1].favoriteOrderHint);
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
