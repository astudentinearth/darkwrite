import { DarkwriteAPIClient } from "@/api/api-client";
import { useLocalStore } from "@/context/local-state";
import { useQuery } from "@tanstack/react-query";
import { LexoRank } from "lexorank";

export const useNotes = () => {
  const workspaceId = useLocalStore((s) => s.workspaceId);

  const query = useQuery({
    queryKey: [workspaceId, "notes"],
    queryFn: async () => {
      const response =
        await DarkwriteAPIClient.note.getAllByWorkspaceId(workspaceId);
      const { notes } = response;
      const noteList = Object.values(notes);

      const favorites = Object.values(notes)
        ?.filter((n) => n.isFavorite && !n.isTrashed)
        .toSorted((a, b) =>
          a.favoriteOrderHint.localeCompare(b.favoriteOrderHint),
        );
      let nextFavoriteHint = "";
      if (!favorites || favorites?.length == 0)
        nextFavoriteHint = LexoRank.middle().toString();
      else
        nextFavoriteHint = LexoRank.parse(
          favorites[favorites.length - 1].favoriteOrderHint,
        )
          .genNext()
          .toString();

      let finalOrderHint: string = "";
      if (notes == null || noteList.length == 0)
        finalOrderHint = LexoRank.middle().genNext().toString();
      else {
        const lastOrderHint = LexoRank.parse(
          noteList[noteList.length - 1].orderHint,
        );
        finalOrderHint = lastOrderHint.genNext().toString();
      }

      return { notes, nextFavoriteHint, finalOrderHint };
    },
  });

  const { data, isFetching, refetch } = query;
  return {
    notes: data?.notes,
    nextFavoriteHint: data?.nextFavoriteHint,
    isFetching,
    refetch,
    finalOrderHint: data?.finalOrderHint
  };
};
