import { FavoriteActionButton } from "./action-favorite";
import { EditorMenu } from "./editor-menu";

export function ActionBar() {
  return (
    <div className="opacity-80 flex gap-1">
      <FavoriteActionButton />
      <EditorMenu />
    </div>
  );
}
