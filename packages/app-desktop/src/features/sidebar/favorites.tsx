import { Note } from "@darkwrite/common/models";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  useNotesQuery,
  useUpdateMultipleNotesMutation,
} from "@/hooks/query";
import { cn } from "@/lib/utils";
import { produce } from "immer";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FavoriteItem } from "./favorite-item";
import { useLocalStore } from "@/context/local-state";
import { useTranslation } from "react-i18next";
import React from "react";

export function FavortiesWidget() {
  const notes = useNotesQuery().data;
  const updateMany = useUpdateMultipleNotesMutation().mutate;
  const open = !useLocalStore((s) => s.favoritesCollapsed);
  const setCollapsed = useLocalStore((s) => s.setFavoritesCollapsed);
  const setOpen = (val: boolean) => setCollapsed(!val);
  const [target, setTarget] = useState<Note[]>([]);
  const { t } = useTranslation();

  const getFavorites = (arr: Note[]) => {
    const favorites = arr.filter((n) => n.isFavorite && !n.isTrashed);
    if (favorites == null) return [];
    favorites.sort((a, b) => a.favoriteOrderHint.localeCompare(b.favoriteOrderHint));
    return favorites;
  };

  useEffect(() => {
    if (!notes) return;
    const favorites = getFavorites(notes);
    setTarget(favorites);
  }, [notes]);

  const render = useCallback(() => {
    const elements: React.JSX.Element[] = [];
    const arr = [...target];
    arr.sort((a, b) => a.favoriteOrderHint.localeCompare(b.favoriteOrderHint));
    if (arr.length === 0) return elements;
    for (let i = 0; i < arr.length; i++) {
      elements.push(
        <FavoriteItem note={arr[i]} key={arr[i].id} index={i}></FavoriteItem>,
      );
    }
    return elements;
  }, [target]);

  const dragEnd = async (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    const updated = produce(target, (draft) => {
      const [removed] = draft.splice(source.index, 1);
      draft.splice(destination.index, 0, removed);
      for (let i = 0; i < draft.length; i++) {
        //TODO IMPLEMENT LEXORANK
        //draft[i].favoriteIndex = i;
      }
      //draft.sort((a, b) => (a.favoriteIndex ?? 0) - (b.favoriteIndex ?? 0));
    });
    const newState = getFavorites(updated);
    setTarget(newState);
    await updateMany(updated);
  };

  return (
    <div className={cn("rounded-[12px]")}>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center select-none text-foreground/50 hover:text-foreground transition-colors text-sm p-1">
            {open ? (
              <ChevronDown size={14}></ChevronDown>
            ) : (
              <ChevronRight size={14}></ChevronRight>
            )}
            <span>{t("sidebar.title.favorites")}</span>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <DragDropContext onDragEnd={dragEnd}>
            <Droppable droppableId="#favorites_droppable">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {render()}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
