import { cn } from "@/utils";
import { Button } from "@darkwrite/ui";
import { Editor } from "@tiptap/core";
import { LucideIcon } from "lucide-react";
import { useCurrentEditor } from "@tiptap/react";

export type BubbleButtonProps = {
  icon: LucideIcon;
  name: string;
  command: (editor: Editor) => void;
  isActive: (editor: ReturnType<typeof useCurrentEditor>) => boolean;
  editor: ReturnType<typeof useCurrentEditor>;
};

export function BubbleButton(props: BubbleButtonProps) {
  const { editor: editorContext } = props;
  return (
      <Button variant="ghost" onClick={()=>{if(editorContext.editor) props.command(editorContext.editor)}} className="rounded-lg size-9 p-0 m-0 flex justify-center items-center *:shrink-0">
        <props.icon
          size={20}
          className={cn(
            "text-foreground",
            props.isActive(editorContext) && "text-primary-text",
          )}
        />
      </Button>
  );
}
