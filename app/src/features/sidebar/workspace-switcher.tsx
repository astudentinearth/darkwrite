import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { WorkspaceLetterIcon } from "@/components/workspace-letter-icon";
import { useCurrentWorkspace } from "@/query/use-workspace";
import { ChevronDown } from "lucide-react";

export function WorkspaceSwitcher() {
  const workspace = useCurrentWorkspace();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-1 w-fit overflow-hidden text-ellipsis whitespace-nowrap opacity-80 p-1 hover:bg-secondary/50 hover:opacity-100 rounded-[8px] select-none transition-[background,opacity] duration-75">
          {workspace && (
            <>
              <WorkspaceLetterIcon workspaceName={workspace.name} />
              <span className="ml-1 text-ellipsis text-sm overflow-hidden whitespace-nowrap">
                {workspace.name}
              </span>
              <ChevronDown className="shrink-0" size={18} />
            </>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="ml-2"></PopoverContent>
    </Popover>
  );
}
