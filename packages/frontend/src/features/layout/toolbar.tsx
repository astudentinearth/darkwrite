import EditorMenu from "../editor/editor-menu";
import StylePopover from "../editor/style-popover";
import FavoriteToggle from "./favorite-toggle";

export default function Toolbar({ noteId }: { noteId: string }) {
  return (
    <div className="flex gap-1">
      <FavoriteToggle id={noteId} />
      <StylePopover id={noteId} />
      <EditorMenu noteId={noteId} />
    </div>
  );
}
