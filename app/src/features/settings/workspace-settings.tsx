import { WorkspaceDTO } from "@/common/dto/response/workspace.response";
import { Button, Label, Switch } from "@/components/ui";
import WorkspaceIcon from "@/components/workspace-icon";
import { useCurrentWorkspace, useUpdateWorkspace } from "@/query/use-workspace";
import {
  Archive,
  Cloud,
  FolderDown,
  HardDrive,
  Languages,
  PenLine,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import EditWorkspaceDialog from "./edit-workspace-dialog";
import SettingsCard from "./settings-card";
import { useSettings, useUpdateSettings } from "@/query/use-settings";
import { produce } from "immer";
import { useWorkspaceExport } from "@/query/use-workspace-export";
import useBackup from "@/query/use-backup";
import { RestoreDataDialog } from "./restore-dialog";

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
  const settings = useSettings().data;
  const { mutate } = useUpdateSettings();
  const exporter = useWorkspaceExport();
  const backup = useBackup();

  const handleUpdateCheck = (val: boolean) => {
    const prefs = produce(settings, (draft) => {
      draft.client.autoUpdateCheck = val;
    });
    mutate(prefs);
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
              {t("settings.workspace.editWorkspace")}
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
      <SettingsCard>
        <div className="flex justify-between items-center">
          <Label htmlFor="auto-update-check-switch">
            {t("settings.privacy.autoUpdateCheckLabel")}
          </Label>
          <Switch
            id="auto-update-check-switch"
            checked={settings.client.autoUpdateCheck}
            onCheckedChange={handleUpdateCheck}
          />
        </div>
      </SettingsCard>
      <SettingsCard>
        <div className="flex justify-between items-center">
          <span>{t("settings.workspace.exportAllText")}</span>
          <Button
            disabled={exporter.exporting}
            variant={"secondary"}
            onClick={() => exporter.export()}
          >
            <FolderDown size={20} />
            {t("settings.workspace.exportAllButton")}
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <span>{t("settings.workspace.backupAndRestoreText")}</span>
          <div className="flex gap-2">
            <Button
              variant={"secondary"}
              onClick={backup.startBackup}
              disabled={backup.isWorking}
            >
              <Archive size={20} />
              {t("settings.workspace.backupButton")}
            </Button>
            <RestoreDataDialog />
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
