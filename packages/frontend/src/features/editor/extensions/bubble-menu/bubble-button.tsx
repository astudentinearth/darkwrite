import type { Editor } from "@tiptap/core";
import type { useCurrentEditor } from "@tiptap/react";
import type { FunctionComponent } from "react";
import { Button } from "@/components/ui";
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type BubbleButtonProps = {
  icon: FunctionComponent<React.SVGProps<SVGSVGElement>>;
  name: string;
  command: (editor: Editor) => void;
  isActive: boolean;
  editor: ReturnType<typeof useCurrentEditor>;
  className?: string;
  title?: string;
};

export function BubbleButton(props: BubbleButtonProps) {
  const { editor: editorContext } = props;
  const button = (
    <Button
      variant="ghost"
      aria-label={props.title}
      onClick={() => {
        if (editorContext.editor) props.command(editorContext.editor);
      }}
      className={cn(
        "rounded-lg size-9 p-0 m-0 flex justify-center items-center *:shrink-0 active:pushdown-98%",
        props.className,
      )}
    >
      <props.icon
        style={{ width: "20px", height: "20px" }}
        className={cn("text-foreground", props.isActive && "text-primary-text")}
      />
    </Button>
  );
  if (!props.title) return button;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipPortal container={document.body}>
        <TooltipContent side="bottom" sideOffset={8}>
          {props.title}
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}
