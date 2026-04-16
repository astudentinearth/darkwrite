import { WorkspaceDTO } from "@darkwrite/common";
import { WorkspaceLetterIcon } from "./workspace-letter-icon";
import { cn } from "@/lib/utils";

export default function WorkspaceIcon(props: {
  workspace: WorkspaceDTO;
  className?: string;
}) {
  const { workspace, className } = props;
  return (
    <>
      {" "}
      {workspace.iconUrl ? (
        <img
          src={workspace.iconUrl}
          className={cn("object-contain rounded-md", className)}
        />
      ) : (
        <WorkspaceLetterIcon
          workspaceName={workspace.name}
          className={className}
        />
      )}
    </>
  );
}
