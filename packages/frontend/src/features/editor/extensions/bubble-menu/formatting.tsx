import { useCurrentEditor } from "@tiptap/react";
import {
  Bold,
  Code,
  Italic,
  Quote,
  Strikethrough,
  Underline,
} from "lucide-react";
import { BubbleButton } from "./bubble-button";
import { useFormattingState } from "../../hooks/use-formatting-state";
import { use } from "react";
import { DarkwriteEditorContext } from "../../context";

export function FormattingButtons() {
  const { editor } = useCurrentEditor();
  const { noteId } = use(DarkwriteEditorContext);
  const { isBold, isItalic, isCode, isStrikethrough, isUnderline, isQuote } =
    useFormattingState(noteId);
  if (!editor) return null;
  return (
    <div className="flex h-9">
      <BubbleButton
        isActive={isBold}
        name="bold"
        icon={Bold}
        editor={{ editor }}
        command={(editor) => {
          editor.chain().focus().toggleBold().run();
        }}
      />
      <BubbleButton
        isActive={isItalic}
        name="italic"
        icon={Italic}
        editor={{ editor }}
        command={(editor) => {
          editor.chain().focus().toggleItalic().run();
        }}
      />
      <BubbleButton
        isActive={isUnderline}
        name="underline"
        icon={Underline}
        editor={{ editor }}
        command={(editor) => {
          editor.chain().focus().toggleUnderline().run();
        }}
      />
      <BubbleButton
        isActive={isStrikethrough}
        name="strike"
        icon={Strikethrough}
        editor={{ editor }}
        command={(editor) => {
          editor.chain().focus().toggleStrike().run();
        }}
      />
      <BubbleButton
        isActive={isCode}
        name="code"
        icon={Code}
        editor={{ editor }}
        command={(editor) => {
          editor.chain().focus().toggleCode().run();
        }}
      />
      <BubbleButton
        isActive={isQuote}
        name="blockquote"
        icon={Quote}
        editor={{ editor }}
        command={(editor) => {
          editor.chain().focus().toggleBlockquote().run();
        }}
      />
    </div>
  );
}
