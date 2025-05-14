import lowlight from "@/editor/lowlight";
import { Button, Select, SelectContent, SelectItem, SelectTrigger } from "@darkwrite/ui";
import { NodeViewProps } from "@tiptap/core";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { Copy } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CodeBlockNodeView(props: NodeViewProps) {
  const language = props.node.attrs.language || "plaintext";
  const languages = lowlight.listLanguages();
  const copy = ()=>{
    navigator.clipboard.writeText(props.node.textContent || "");
  }
  const { t } = useTranslation(undefined, {keyPrefix: "editor.contextmenu"})
  return (
    <NodeViewWrapper>
      <div className="flex flex-col group [&>pre]:m-0 [&>pre]:pb-3 [&>pre]:px-3 [&>pre]:pt-0 [&>pre]:bg-transparent rounded-xl bg-secondary/50 border">
        <div spellCheck={false} className="p-1 flex justify-start">
          <Select onValueChange={val => props.updateAttributes({language: val})} value={language}>
            <SelectTrigger className="w-fit border-none opacity-60 group-hover:opacity-100 shrink-0 hover:bg-secondary h-fit transition-[background,opacity] text-xs aria-expanded:bg-secondary/80">
              {language}
            </SelectTrigger>
            <SelectContent hideArrows>
              {languages.map(lang => <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>)}
            </SelectContent>
          </Select>
          <div className="grow"></div>
          <Button variant={"ghost"} onClick={copy} className="justify-self-end opacity-0 transition-opacity group-hover:opacity-100 shrink-0 text-xs h-fit p-2 text-foreground/70 hover:text-foreground">
            <Copy size={16}/> {t("copy")}
          </Button>
        </div>
        <pre spellCheck={false} className={`language-${language}`}>
          <NodeViewContent as="code" />
        </pre>
      </div>
    </NodeViewWrapper>
  );
}
