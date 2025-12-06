import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { Editor } from "@tiptap/core";
import { useCurrentEditor } from "@tiptap/react";
import { FunctionComponent } from "react";

export type BubbleButtonProps = {
  icon: FunctionComponent<React.SVGProps<SVGSVGElement>>;
  name: string;
  command: (editor: Editor) => void;
  isActive: (editor: ReturnType<typeof useCurrentEditor>) => boolean;
  editor: ReturnType<typeof useCurrentEditor>;
  className?: string;
  title?: string;
};

export function BubbleButton(props: BubbleButtonProps) {
  const { editor: editorContext } = props;
  return (
    <Button
      variant="ghost"
      title={props.title}
      onClick={() => {
        if (editorContext.editor) props.command(editorContext.editor);
      }}
      className={cn(
        "rounded-lg size-9 p-0 m-0 flex justify-center items-center *:shrink-0",
        props.className,
      )}
    >
      <props.icon
        style={{ width: "20px", height: "20px" }}
        className={cn(
          "text-foreground",
          props.isActive(editorContext) && "text-primary-text",
        )}
      />
    </Button>
  );
}
