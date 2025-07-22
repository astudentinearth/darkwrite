
export function WorkspaceLetterIcon({workspaceName}: {workspaceName: string}) {
  return <div className="w-6 h-6 rounded-[4px] bg-primary/50 font-semibold flex justify-center items-center shrink-0">
    {workspaceName.at(0) || "?"}
  </div>
}