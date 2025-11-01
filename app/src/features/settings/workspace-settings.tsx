import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Label,
} from "@/components/ui";
import { useCurrentWorkspace, useUpdateWorkspace } from "@/query/use-workspace";
import EditWorkspaceDialog from "./edit-workspace-dialog";
import { WorkspaceDTO } from "@/common/dto/response/workspace.response";
import { useState } from "react";
import WorkspaceIcon from "@/components/workspace-icon";
import { Cloud, HardDrive, Languages, PenLine } from "lucide-react";
import { useTranslation } from "react-i18next";
import SettingsCard from "./settings-card";

export default function WorkspaceSettings() {
  const currentWorkspace = useCurrentWorkspace();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const update = useUpdateWorkspace();
  const { t: tW } = useTranslation("translation", {
    keyPrefix: "sidebar.workspace",
  });
  const { t, i18n } = useTranslation();
  const save = async (w: WorkspaceDTO) => {
    update.mutate(w);
    setEditDialogOpen(false);
  };
  return (
    <div className="w-full flex flex-col items-center pt-3 gap-4">
      {currentWorkspace && (
        <SettingsCard>
          {" "}
          <div className="flex gap-4">
            <WorkspaceIcon
              className="size-16 rounded-xl text-3xl"
              workspace={currentWorkspace}
            />
            <div className="flex flex-col">
              <h1 className="text-2xl font-medium">{currentWorkspace.name}</h1>
              <span className="flex gap-2 items-center text-sm text-popover-foreground/80">
                {currentWorkspace.config.syncMode === "offline" ? (
                  <HardDrive size={18}></HardDrive>
                ) : (
                  <Cloud size={18}></Cloud>
                )}
                {tW(currentWorkspace.config.syncMode)}
              </span>
            </div>
          </div>
          <EditWorkspaceDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            workspace={currentWorkspace}
            onSave={save}
          >
            <Button variant={"secondary"} className="w-fit">
              <PenLine size={18} />
              Edit workspace
            </Button>
          </EditWorkspaceDialog>
        </SettingsCard>
      )}
      <SettingsCard>
        <div className="flex justify-between items-center">
          <Label className="items-center flex gap-2">
            <Languages className="size-5" />
            {t("settings.workspace.languageText")}
          </Label>
          <div className="flex gap-2">
            <Button
              onClick={() => i18n.changeLanguage("en")}
              variant={i18n.language == "en" ? "default" : "outline"}
            >
              English
            </Button>
            <Button
              onClick={() => i18n.changeLanguage("tr")}
              variant={i18n.language == "tr" ? "default" : "outline"}
            >
              Türkçe
            </Button>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
