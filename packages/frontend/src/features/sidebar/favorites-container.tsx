import { skipToken } from "@reduxjs/toolkit/query";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { FavoritesView } from "../note/components/favorites";
import { useGetFavoritesByWorkspaceIdQuery } from "../note/store/notes-api";
import { useSessionActions } from "../session/session-actions";
import { useFavoritesViewOpen } from "../session/session-hooks";
import { useCurrentWorkspaceId } from "../workspaces/hooks/use-workspace";
import { SidebarItem } from "./sidebar-item";

function PrefetchFavorites() {
  const workspaceId = useCurrentWorkspaceId();
  useGetFavoritesByWorkspaceIdQuery(workspaceId ?? skipToken);
  return null;
}

export default function FavoritesContainer() {
  const { t } = useTranslation("translation", { keyPrefix: "sidebar" });
  const open = useFavoritesViewOpen();
  const { setFavoritesViewOpen } = useSessionActions();
  return (
    <>
      <PrefetchFavorites />
      <Collapsible open={open} onOpenChange={setFavoritesViewOpen}>
        <CollapsibleTrigger asChild>
          <SidebarItem className="w-full gap-1">
            {t("title.favorites")}
            <ChevronRight
              size={16}
              className={cn(
                "transition-transform duration-100",
                open && "rotate-90",
              )}
            />
          </SidebarItem>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <FavoritesView />
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
