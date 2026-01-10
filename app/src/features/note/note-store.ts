import { DarkwriteAPIClient } from "@/api/api-client";
import { CreateNoteDTO, NoteDTO, UpdateNoteDTO } from "@/common/dto";
import { Rank } from "@/common/rank";
import { useMemo } from "react";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

type INotesStore = Record<string, NoteDTO>;

export class NotesViewModel {
  static store = create<INotesStore>()(() => ({}));
  static snapshots = new Map<string, NoteDTO>();

  public static async update(id: string, dto: UpdateNoteDTO) {
    const existing = NotesViewModel.store.getState()[id];
    const updated = { ...existing, ...dto };
    NotesViewModel.store.setState((state) => ({
      ...state,
      id: updated,
    }));

    if (!NotesViewModel.snapshots.has(id)) {
      NotesViewModel.snapshots.set(id, existing);
    }

    try {
      const result = await DarkwriteAPIClient.note.update(id, dto);
      NotesViewModel.store.setState((state) => ({
        ...state,
        [id]: result.note!,
      }));
      NotesViewModel.snapshots.delete(id);
      return result;
    } catch (err) {
      const snapshot = NotesViewModel.snapshots.get(id);
      if (snapshot) {
        NotesViewModel.store.setState((state) => ({
          ...state,
          [id]: snapshot,
        }));
        NotesViewModel.snapshots.delete(id);
      }
      throw err;
    }
  }

  public static async refetchAll(workspaceId: string) {
    const result =
      await DarkwriteAPIClient.note.getAllByWorkspaceId(workspaceId);
    NotesViewModel.snapshots.clear();
    NotesViewModel.store.setState(result.notes);
  }

  public static async resetStore() {
    NotesViewModel.store.setState({});
    NotesViewModel.snapshots.clear();
  }

  public static async delete(noteOrId: string | NoteDTO) {
    const id = typeof noteOrId === "string" ? noteOrId : noteOrId.id;
    NotesViewModel.store.setState((state) => {
      const newState = { ...state };
      delete newState[id];
      return newState;
    });
    await DarkwriteAPIClient.note.delete(id);
  }

  public static async create(dto: CreateNoteDTO) {
    const result = await DarkwriteAPIClient.note.create(dto);
    if (result.note) {
      NotesViewModel.store.setState((state) => ({
        ...state,
        [result.note!.id]: result.note!,
      }));
    }
    return result;
  }

  public static async duplicate(id: string) {
    const result = await DarkwriteAPIClient.note.duplicate(id);
    if (result.note) {
      NotesViewModel.store.setState((state) => ({
        ...state,
        [result.note!.id]: result.note!,
      }));
    }
    return result;
  }
}

export const useNotesStore = NotesViewModel.store;
export const useNote = (id: string) => useNotesStore((state) => state[id]);
export const useNotes = () => useNotesStore((state) => Object.values(state));

/**
 * Hook to get children of a note, sorted by orderHint.
 * Uses useShallow to prevent unnecessary re-renders.
 */
export const useChildren = (parentId: string | null) => {
  const children = useNotesStore(
    useShallow((state) =>
      Object.values(state)
        .filter((note) => note.parentId === parentId && !note.isTrashed)
        .sort((a, b) => Rank.sorter(a.orderHint, b.orderHint)),
    ),
  );
  return children;
};

/**
 * Hook to get favorite notes, sorted by favoriteOrderHint.
 * Uses useShallow to prevent unnecessary re-renders.
 */
export const useFavorites = () => {
  const favorites = useNotesStore(
    useShallow((state) =>
      Object.values(state)
        .filter((note) => note.isFavorite && !note.isTrashed)
        .sort((a, b) => Rank.sorter(a.favoriteOrderHint, b.favoriteOrderHint)),
    ),
  );
  return favorites;
};

/**
 * Hook to get order hints for a note list.
 * Recalculates when children change.
 */
export const useOrderHints = (parentId: string | null) => {
  const children = useChildren(parentId);

  return useMemo(() => {
    const leadingHint =
      children.length === 0
        ? Rank.default().toString()
        : new Rank(children[0].orderHint).prev().toString();

    const finalHint =
      children.length === 0
        ? Rank.default().next().toString()
        : new Rank(children[children.length - 1].orderHint).next().toString();

    const getHintBetween = (currentIndex: number) => {
      if (currentIndex >= children.length - 1) {
        return finalHint;
      }
      return Rank.between(
        children[currentIndex].orderHint,
        children[currentIndex + 1].orderHint,
      ).toString();
    };

    return { leadingHint, finalHint, getHintBetween };
  }, [children]);
};

/**
 * Hook to get the next favorite order hint.
 * Recalculates when favorites change.
 */
export const useNextFavoriteOrderHint = () => {
  const favorites = useFavorites();

  return useMemo(() => {
    if (favorites.length === 0) {
      return Rank.default().toString();
    }
    return new Rank(favorites[favorites.length - 1].favoriteOrderHint)
      .next()
      .toString();
  }, [favorites]);
};
