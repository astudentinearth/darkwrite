import EditorMenu from "../editor/editor-menu";
import StylePopover from "../editor/style-popover";
import FavoriteToggle from "./favorite-toggle";

export default function Toolbar() {
  return (
    <div className="flex gap-1">
      <FavoriteToggle />
      <StylePopover />
      <EditorMenu />
    </div>
  );
}
