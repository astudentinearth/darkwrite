import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { FavoritesView } from "../note/components/favorites";
import { useSessionActions } from "../session/session-actions";
import { useFavoritesViewOpen } from "../session/session-hooks";
import { SidebarItem } from "./sidebar-item";

export default function FavoritesContainer() {
  const { t } = useTranslation("translation", { keyPrefix: "sidebar" });
  const open = useFavoritesViewOpen();
  const { setFavoritesViewOpen } = useSessionActions();
  return (
    <>
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
