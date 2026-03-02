import { Button } from "@/components/ui";
import { NodeViewProps } from "@tiptap/core";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { Check, Copy } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageChooser from "./language-chooser";
import lowlight from "../../lowlight";
import { useState } from "react";

export default function CodeBlockNodeView(props: NodeViewProps) {
  const language = props.node.attrs.language || "plaintext";
  const languages = lowlight.listLanguages();
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(props.node.textContent || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };
  const updateLanguage = (language: string) => {
    props.updateAttributes({ language });
  };
  const { t } = useTranslation(undefined, { keyPrefix: "editor.contextmenu" });
  return (
    <NodeViewWrapper>
      <div className="flex flex-col group top-highlight [&>pre]:m-0 [&>pre]:pb-3 [&>pre]:px-3 [&>pre]:pt-0 [&>pre]:bg-transparent rounded-xl bg-view-2/75 border">
        <div spellCheck={false} className="p-1 flex justify-start">
          <LanguageChooser
            languages={languages}
            value={language}
            onValueChange={updateLanguage}
          />
          <div className="grow"></div>
          <Button
            variant={"ghost"}
            onClick={copy}
            className="justify-self-end opacity-0 transition-opacity group-hover:opacity-100 shrink-0 text-xs h-fit p-2 text-foreground/70 hover:text-foreground"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />} {t("copy")}
          </Button>
        </div>
        <pre spellCheck={false} className={`language-${language}`}>
          <NodeViewContent />
        </pre>
      </div>
    </NodeViewWrapper>
  );
}
