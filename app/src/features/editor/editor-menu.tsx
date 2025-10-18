import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSwitchItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { useEditorCommand } from "./use-editor-command";
import { HeaderbarButton } from "@/components/headerbar-button";
import { Download, FileCode, FileText, Menu, Redo, Undo } from "lucide-react";
import { useLocalStore } from "@/context/local-state";
import { useNoteFromURL } from "@/query/use-note-from-url";
import { useTranslation } from "react-i18next";
import useNoteExport from "@/hooks/use-note-export";

export default function EditorMenu() {
  const commands = useEditorCommand();
  const spellcheck = useLocalStore((s) => s.useSpellcheck);
  const exporter = useNoteExport();
  const setSpellcheck = useLocalStore((s) => s.setSpellcheck);
  const { t } = useTranslation();
  const noteId = useNoteFromURL();
  if (!noteId) return <></>;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <HeaderbarButton>
          <Menu size={20} />
        </HeaderbarButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSwitchItem
          checked={spellcheck}
          onCheckedChange={setSpellcheck}
        >
          {t("editor.menu.checkSpelling")}
        </DropdownMenuSwitchItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Download size={18} />
            {t("editor.menu.export")}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onSelect={exporter.exportHTML}>
              <FileCode size={18} />
              {t("editor.menu.htmlExport")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText size={18} />
              {t("editor.menu.jsonExport")}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={commands.get()?.undo}>
          <Undo size={20} />
          {t("editor.menu.undo")}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={commands.get()?.redo}>
          <Redo size={20} />
          {t("editor.menu.redo")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
