import { Button } from "@renderer/components/ui/button";
import { cn } from "@renderer/lib/utils";
import { Editor } from "@tiptap/core";
import { LucideIcon } from "lucide-react";
import { EditorBubbleItem, useEditor } from "novel";

export type BubbleButtonProps = {
  icon: LucideIcon;
  name: string;
  command: (editor: Editor) => void;
  isActive: (editor: ReturnType<typeof useEditor>) => boolean;
  editor: ReturnType<typeof useEditor>;
};

export function BubbleButton(props: BubbleButtonProps) {
  const { editor } = props;
  return (
    <EditorBubbleItem onSelect={(editor) => props.command(editor)}>
      <Button variant="ghost" size={"bubble"} className="rounded-none">
        <props.icon
          size={20}
          className={cn(props.isActive(editor) && "text-primary-text")}
        />
      </Button>
    </EditorBubbleItem>
  );
}
