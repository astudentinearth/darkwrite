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
import { cn } from "@/lib/utils";
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
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PageSizeChooser } from "../export/page-size-chooser";
import useEditorMenu from "./hooks/use-editor-menu";

function EditorMenuContent({ noteId }: { noteId: string }) {
  const spellcheck = useLocalStore((s) => s.useSpellcheck);
  const setSpellcheck = useLocalStore((s) => s.setSpellcheck);
  const { actions, isTrashed, wordCount } = useEditorMenu(noteId);
  const { t } = useTranslation();

  return (
    <DropdownMenuContent className="mr-2">
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
          <DropdownMenuItem onSelect={actions.exportHTML}>
            <FileCode size={18} />
            {t("editor.menu.htmlExport")}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={actions.exportJSON}>
            <FileText size={18} />
            {t("editor.menu.jsonExport")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={actions.exportPDF}>
            <FileText size={18} />
            PDF
          </DropdownMenuItem>
          <PageSizeChooser className="bg-secondary mt-small" />
        </DropdownMenuSubContent>
      </DropdownMenuSub>
      <DropdownMenuItem onSelect={actions.importNotes}>
        <Upload size={18} />
        {t("editor.menu.import")}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={actions.undo}>
        <Undo size={20} />
        {t("editor.menu.undo")}
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={actions.redo}>
        <Redo size={20} />
        {t("editor.menu.redo")}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={actions.toggleTrash}>
        {isTrashed ? <Undo2 size={20} /> : <Trash size={20} />}
        {isTrashed
          ? t("sidebar.trash.restore")
          : t("sidebar.notes.contextmenu.trash")}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <div className="text-muted-foreground text-sm px-3 py-1">
        {t("editor.menu.wordCount", { count: wordCount })}
      </div>
    </DropdownMenuContent>
  );
}

export default function EditorMenu() {
  const [open, setOpen] = useState(false);
  const noteId = useNoteFromURL();
  if (!noteId) return <></>;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <HeaderbarButton className={cn(open && "bg-secondary/50")}>
          <Menu size={20} />
        </HeaderbarButton>
      </DropdownMenuTrigger>
      <EditorMenuContent noteId={noteId} />
    </DropdownMenu>
  );
}
