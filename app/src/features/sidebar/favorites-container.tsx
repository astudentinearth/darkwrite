import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import FavoriteNoteList from "./favorite-note-list";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function FavoritesContainer() {
  const { t } = useTranslation("translation", { keyPrefix: "sidebar" });
  const [open, setOpen] = useState(false);
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
        <FavoriteNoteList />
      </CollapsibleContent>
    </Collapsible>
  );
}
