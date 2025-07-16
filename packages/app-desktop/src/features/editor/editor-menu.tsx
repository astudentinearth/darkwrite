import { countWords } from "@darkwrite/common";
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
} from "@darkwrite/ui";
import { NoteAPI } from "@/api";
import { HeaderbarButton } from "@/components/ui/headerbar-button";
import { useEditorState } from "@/context/editor-state";
import { useLocalStore } from "@/context/local-state";
import { useNoteByIdQuery } from "@/hooks/query";
import { useDuplicateNoteMutation } from "@/hooks/query/use-duplicate-note-mutation";
import { useExport } from "@/hooks/use-export";
import { useNoteFromURL } from "@/hooks/use-note-from-url";
import { cn } from "@/lib/utils";
import { Copy, Download, FileCode, FileText, Menu, Redo, Undo, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function EditorMenu() {
  const { t } = useTranslation(undefined, { keyPrefix: "editor.menu" });
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState({ words: 0 });
  const editor = useEditorState((state) => state.editorInstance);
  const content = useEditorState((state) => state.content);
  const activeNoteId = useNoteFromURL();
  const activeNote = useNoteByIdQuery(activeNoteId ?? "");
  const checker = useLocalStore((s) => s.useSpellcheck);
  const setCheck = useLocalStore((s) => s.setSpellcheck);
  const duplicate = useDuplicateNoteMutation().mutate;
  const _export = useExport();

  // we don't want to cause issues if the document is very long
  const updateWordCount = async () => {
    if (!editor || !content) return;
    const words = countWords(editor.getText());
    setCount({ words });
  };

  useEffect(() => {
    if (!open) return; // we don't need to count words if we are not going to display them
    updateWordCount();
  }, [editor, content, open]);
  if (!activeNoteId) return <></>;

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <HeaderbarButton
            className={cn(open && "bg-secondary/80 opacity-100")}
          >
            <Menu size={18} />
          </HeaderbarButton>
        </DropdownMenuTrigger>

        {/* TODO: Unify dropdown menu item style */}
        <DropdownMenuContent className="mr-3 mt-1 rounded-xl bg-card/90 !overflow-visible">
          <DropdownMenuSwitchItem
            checked={checker}
            onCheckedChange={(val) => setCheck(val)}
          >
            {t("checkSpelling")}
          </DropdownMenuSwitchItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {" "}
              <Download size={18} />
              {t("export")}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="bg-card">
              <DropdownMenuItem disabled className="hidden" onSelect={() => {
              if (!activeNote.data) return;
              //TODO MIGRATE API
              //_export(activeNote.data, "json");
            }}><FileText size={18}/>{t("jsonExport")}</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {
              if (!activeNote.data) return;
              //TODO MIGRATE API
              //_export(activeNote.data);
            }}><FileCode size={18}/>{t("htmlExport")}</DropdownMenuItem>
            <span className="p-2 text-card-foreground/80 text-xs">{t("imageWarning")}</span>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem
            onSelect={async () => {
              const html = await NoteAPI().importFile();
              if (!html) {
                console.error("Failed to import note");
                return;
              }
              editor?.commands.insertContent(html.content);
            }}
            className="gap-2 rounded-lg"
          >
            <Upload size={18} />
            {t("import")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => duplicate(activeNoteId)}
            className="gap-2 rounded-lg"
          >
            <Copy size={18} />
            {t("duplicate")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 rounded-lg"
            onSelect={(e) => {
              e.preventDefault();
              editor?.commands.undo();
            }}
          >
            <Undo size={18} />
            {t("undo")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2 rounded-lg"
            onSelect={(e) => {
              e.preventDefault();
              editor?.commands.redo();
            }}
          >
            <Redo size={18} />
            {t("redo")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="px-2 text-sm text-foreground/75">
            <span className="block">
              {t("wordCount", { count: count.words })}
            </span>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
