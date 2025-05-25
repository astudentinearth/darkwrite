import { Button } from "@darkwrite/ui";
import { cn } from "@renderer/lib/utils";
import { Editor } from "@tiptap/core";
import { LucideIcon } from "lucide-react";
import { EditorBubbleItem, useEditor } from "novel";

/** @deprecated - use darkwrite/editor instead. */
export type BubbleButtonProps = {
  icon: LucideIcon;
  name: string;
  command: (editor: Editor) => void;
  isActive: (editor: ReturnType<typeof useEditor>) => boolean;
  editor: ReturnType<typeof useEditor>;
};

/** @deprecated - use darkwrite/editor instead. */
export function BubbleButton(props: BubbleButtonProps) {
  const { editor } = props;
  return (
    <EditorBubbleItem onSelect={(editor) => props.command(editor)}>
      <Button variant="ghost" className="rounded-lg size-9 p-0 m-0 flex justify-center items-center *:shrink-0">
        <props.icon
          size={20}
          className={cn(
            "text-foreground",
            props.isActive(editor) && "text-primary-text",
          )}
        />
      </Button>
    </EditorBubbleItem>
  );
}
