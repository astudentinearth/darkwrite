import { useEditor } from "novel";
import {
  Bold,
  Code,
  Italic,
  Quote,
  Strikethrough,
  Underline,
} from "lucide-react";
import { BubbleButton } from "./bubble-button";

/** @deprecated - use darkwrite/editor instead. */
export function FormattingButtons() {
  const { editor } = useEditor();
  if (!editor) return null;
  return (
    <div className="flex h-9">
      <BubbleButton
        isActive={(e) => e.editor?.isActive("bold") ?? false}
        name="bold"
        icon={Bold}
        editor={{ editor }}
        command={(editor) => {
          editor.chain().focus().toggleBold().run();
        }}
      />
      <BubbleButton
        isActive={(e) => e.editor?.isActive("italic") ?? false}
        name="italic"
        icon={Italic}
        editor={{ editor }}
        command={(editor) => {
          editor.chain().focus().toggleItalic().run();
        }}
      />
      <BubbleButton
        isActive={(e) => e.editor?.isActive("underline") ?? false}
        name="underline"
        icon={Underline}
        editor={{ editor }}
        command={(editor) => {
          editor.chain().focus().toggleUnderline().run();
        }}
      />
      <BubbleButton
        isActive={(e) => e.editor?.isActive("strike") ?? false}
        name="strike"
        icon={Strikethrough}
        editor={{ editor }}
        command={(editor) => {
          editor.chain().focus().toggleStrike().run();
        }}
      />
      <BubbleButton
        isActive={(e) => e.editor?.isActive("code") ?? false}
        name="code"
        icon={Code}
        editor={{ editor }}
        command={(editor) => {
          editor.chain().focus().toggleCode().run();
        }}
      />
      <BubbleButton
        isActive={(e) => e.editor?.isActive("blockquote") ?? false}
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
