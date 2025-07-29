import { cn } from "@/lib/utils";

export function WorkspaceLetterIcon({
  workspaceName,
  className,
}: {
  workspaceName: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-6 h-6 rounded-[4px] bg-primary/50 font-semibold flex justify-center items-center shrink-0",
        className,
      )}
    >
      {workspaceName.at(0) || "?"}
    </div>
  );
}
