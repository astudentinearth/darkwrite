import {
  ContextMenuContent,
  ContextMenuItem,
} from "@darkwrite/ui";
import { useEditorState } from "@/context/editor-state";
import { Clipboard, Copy, Delete, Scissors } from "lucide-react";
import { useTranslation } from "react-i18next";

export function EditorContextMenuContent() {
  const { t } = useTranslation(undefined, { keyPrefix: "editor.contextmenu" });
  //TODO: Find another way to do this without execCommand. It's getting the job done so we are keeping this now
  const editor = useEditorState((s) => s.editorInstance);
  const copy = () => {
    document.execCommand("copy");
  };
  const paste = () => {
    document.execCommand("paste");
  };
  const cut = () => {
    document.execCommand("cut");
  };
  const _delete = () => {
    editor?.commands.deleteSelection();
  };
  return (
    <ContextMenuContent className="bg-view-2/80 *:gap-2">
      <ContextMenuItem onSelect={copy}>
        <Copy size={18} /> {t("copy")}
      </ContextMenuItem>
      <ContextMenuItem onSelect={cut}>
        <Scissors size={18} /> {t("cut")}
      </ContextMenuItem>
      <ContextMenuItem onSelect={paste}>
        <Clipboard size={18} /> {t("paste")}
      </ContextMenuItem>
      <ContextMenuItem onSelect={_delete}>
        <Delete size={18} /> {t("delete")}
      </ContextMenuItem>
    </ContextMenuContent>
  );
}
