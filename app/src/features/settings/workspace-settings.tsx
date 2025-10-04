import { AlertDialog, AlertDialogContent, AlertDialogTrigger, Dialog, DialogContent, DialogTrigger } from "@/components/ui";
import { useCurrentWorkspace, useUpdateWorkspace } from "@/query/use-workspace";
import EditWorkspaceDialog from "./edit-workspace-dialog";
import { WorkspaceDTO } from "@/common/dto/response/workspace.response";
import { useState } from "react";

export default function WorkspaceSettings() {
  const currentWorkspace = useCurrentWorkspace();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const update = useUpdateWorkspace();
  const save = async (w: WorkspaceDTO) => {
    update.mutate(w);
    setEditDialogOpen(false);
  }
  return <div className="w-full flex flex-col items-center pt-3 gap-4">
    {currentWorkspace && <EditWorkspaceDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} workspace={currentWorkspace} onSave={save} />}
  </div>
}

