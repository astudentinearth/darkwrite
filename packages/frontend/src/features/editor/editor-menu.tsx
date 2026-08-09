import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { IconMarkdown, IconMenu2 } from "@tabler/icons-react";
import {
  Download,
  FileCode,
  FileText,
  Forward,
  Redo,
  Trash,
  Undo,
  Undo2,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
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
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { useLocalStore } from "@/context/local-state";
import { useAppSelector } from "@/features/store/hooks";
import { cn } from "@/lib/utils";
import { PageSizeChooser } from "../export/page-size-chooser";
import useEditorMenu from "./hooks/use-editor-menu";
import { selectEditorEditable } from "./store/editor-selectors";

function EditorMenuContent({ noteId }: { noteId: string }) {
  const spellcheck = useLocalStore((s) => s.useSpellcheck);
  const setSpellcheck = useLocalStore((s) => s.setSpellcheck);
  const editable = useAppSelector(selectEditorEditable);
  const { actions, isTrashed, wordCount, canUndo, canRedo } =
    useEditorMenu(noteId);
  const { t } = useTranslation();

  return (
    <DropdownMenuContent className="mr-2 top-highlight bg-view-2/85">
      <DropdownMenuSwitchItem
        checked={spellcheck}
        onCheckedChange={setSpellcheck}
      >
        {t("editor.menu.checkSpelling")}
      </DropdownMenuSwitchItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={actions.move}>
        <Forward className="opacity-75" size={18}></Forward>
        {t("sidebar.notes.contextmenu.moveTo")}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <Download size={18} />
          {t("editor.menu.export")}
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="bg-view-2 top-highlight">
          <DropdownMenuItem onSelect={actions.exportHTML}>
            <FileCode size={18} />
            {t("editor.menu.htmlExport")}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={actions.exportJSON}>
            <FileText size={18} />
            {t("editor.menu.jsonExport")}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={actions.exportMarkdown}>
            <IconMarkdown size={18} />
            Markdown
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={actions.exportPDF}>
            <FileText size={18} />
            PDF
          </DropdownMenuItem>
          <PageSizeChooser className="bg-view-1 top-highlight mt-small" />
        </DropdownMenuSubContent>
      </DropdownMenuSub>
      <DropdownMenuItem disabled={!editable} onSelect={actions.importNotes}>
        <Upload size={18} />
        {t("editor.menu.import")}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        disabled={!editable || !canUndo}
        onSelect={(e) => {
          actions.undo();
          e.preventDefault();
        }}
      >
        <Undo size={20} />
        {t("editor.menu.undo")}
      </DropdownMenuItem>
      <DropdownMenuItem
        disabled={!editable || !canRedo}
        onSelect={(e) => {
          actions.redo();
          e.preventDefault();
        }}
      >
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

export default function EditorMenu({ noteId }: { noteId: string }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <Tooltip>
        <DropdownMenuTrigger asChild>
          <TooltipTrigger>
            <HeaderbarButton className={cn(open && "bg-secondary/50")}>
              <IconMenu2 size={20} />
            </HeaderbarButton>
          </TooltipTrigger>
        </DropdownMenuTrigger>
        <TooltipContent>{t("editor.menu.tooltip")}</TooltipContent>
      </Tooltip>
      <EditorMenuContent noteId={noteId} />
    </DropdownMenu>
  );
}
