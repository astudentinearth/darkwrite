import { WorkspaceDTO } from "@/common/dto/response/workspace.response";
import { Button } from "@/components/ui/button";
import WorkspaceIcon from "@/components/workspace-icon";
import { cn } from "@/lib/utils";

export function WorkspaceItem({
  className,
  workspace,
  ...props
}: {
  workspace: WorkspaceDTO;
  active?: boolean;
} & React.ComponentProps<"button">) {
  return (
    <Button
      {...props}
      variant={"ghost"}
      className={cn(
        "flex justify-start p-1 w-full h-fit gap-3 items-center",
        props.active && "bg-secondary/15",
        className,
      )}
    >
      <WorkspaceIcon workspace={workspace} className="w-8 h-8 text-lg" />
      <div className="flex flex-col text-start">
        <span>{workspace.name}</span>
      </div>
    </Button>
  );
}
