import { HeaderbarButton } from "@/components/headerbar-button";
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
import { useLocalStore } from "@/context/local-state";
import useNoteExport from "@/hooks/use-note-export";
import useNoteImport from "@/hooks/use-note-import";
import { useNoteFromURL } from "@/query/use-note-from-url";
import { useUpdateNote } from "@/query/use-update-note";
import {
  Download,
  FileCode,
  FileText,
  Menu,
  Redo,
  Trash,
  Undo,
  Upload,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEditorCommand } from "./use-editor-command";
import { PageSizeChooser } from "../export/page-size-chooser";

export default function EditorMenu() {
  const commands = useEditorCommand();
  const spellcheck = useLocalStore((s) => s.useSpellcheck);
  const exporter = useNoteExport();
  const importer = useNoteImport();
  const { update } = useUpdateNote();
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
          <DropdownMenuSubContent className="bg-view-2">
            <DropdownMenuItem onSelect={exporter.exportHTML}>
              <FileCode size={18} />
              {t("editor.menu.htmlExport")}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={exporter.exportJSON}>
              <FileText size={18} />
              {t("editor.menu.jsonExport")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={exporter.exportPdf}>
              <FileText size={18} />
              PDF
            </DropdownMenuItem>
            <PageSizeChooser className="bg-secondary mt-small" />
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem onSelect={importer.importNotes}>
          <Upload size={18} />
          {t("editor.menu.import")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={commands.get()?.undo}>
          <Undo size={20} />
          {t("editor.menu.undo")}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={commands.get()?.redo}>
          <Redo size={20} />
          {t("editor.menu.redo")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            update({ id: noteId, dto: { isTrashed: true } });
          }}
        >
          <Trash size={20} />
          {t("sidebar.notes.contextmenu.trash")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="text-muted-foreground text-sm px-3 py-1">
          {t("editor.menu.wordCount", { count: commands.get()?.countWords() })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
