import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FavoritesView } from "../note/components/favorites";
import { setFavoritesViewOpen } from "../session/session-actions";
import { useFavoritesViewOpen } from "../session/session-hooks";

export default function FavoritesContainer() {
  const { t } = useTranslation("translation", { keyPrefix: "sidebar" });
  const open = useFavoritesViewOpen();
  const setOpen = setFavoritesViewOpen;
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button
          className="text-xs p-1 gap-1 h-fit w-full text-foreground/80 hover:text-foreground justify-start"
          variant={"ghost"}
        >
          <ChevronRight
            size={16}
            className={cn(
              "transition-transform duration-100",
              open && "rotate-90",
            )}
          />
          {t("title.favorites")}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <FavoritesView />
      </CollapsibleContent>
    </Collapsible>
  );
}
