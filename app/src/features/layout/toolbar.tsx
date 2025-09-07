import { HeaderbarButton } from "@/components/headerbar-button";
import StylePopover from "../editor/style-popover";
import FavoriteToggle from "./favorite-toggle";
import { Brush } from "lucide-react";

export default function Toolbar(){
  return <div className="flex gap-1">
    <FavoriteToggle />
    <StylePopover>
      <HeaderbarButton>
      <Brush
        size={20}
      />
    </HeaderbarButton>
    </StylePopover>
  </div>
}