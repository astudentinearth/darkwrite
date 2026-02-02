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
import { NoteExporter } from "../export/note-exporter";
import useNoteImport from "@/hooks/use-note-import";
import { useNoteFromURL } from "@/query/use-note-from-url";
import {
  Download,
  FileCode,
  FileText,
  Menu,
  Redo,
  Trash,
  Undo,
  Undo2,
  Upload,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEditorCommand } from "./use-editor-command";
import { PageSizeChooser } from "../export/page-size-chooser";
import { useNoteById } from "../note/hooks/use-note-by-id";
import { moveToTrash, restoreFromTrash } from "../note/store/note-actions";

export default function EditorMenu() {
  const commands = useEditorCommand();
  const spellcheck = useLocalStore((s) => s.useSpellcheck);
  const importer = useNoteImport();
  const setSpellcheck = useLocalStore((s) => s.setSpellcheck);

  const { t } = useTranslation();
  const noteId = useNoteFromURL();
  const { note } = useNoteById(noteId);
  if (!noteId || !note) return <></>;

  const { exportHTML, exportJSON, exportPDF } = NoteExporter;

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
            <DropdownMenuItem onSelect={() => exportHTML(noteId)}>
              <FileCode size={18} />
              {t("editor.menu.htmlExport")}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => exportJSON(noteId)}>
              <FileText size={18} />
              {t("editor.menu.jsonExport")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => exportPDF(noteId)}>
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
            if (note.isTrashed) restoreFromTrash(note.id);
            else moveToTrash(note.id);
          }}
        >
          {note.isTrashed ? <Undo2 size={20} /> : <Trash size={20} />}

          {note.isTrashed
            ? t("sidebar.trash.restore")
            : t("sidebar.notes.contextmenu.trash")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="text-muted-foreground text-sm px-3 py-1">
          {t("editor.menu.wordCount", { count: commands.get()?.countWords() })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
