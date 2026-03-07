import { WorkspaceDTO } from "@/common/dto/response/workspace.response";
import { Button, Input, Label, Switch } from "@/components/ui";
import WorkspaceIcon from "@/components/workspace-icon";
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
import { useWorkspaceExport } from "@/features/workspaces/hooks/use-workspace-export";
import useBackup from "@/features/backup/hooks/use-backup";
import { RestoreDataDialog } from "./restore-dialog";
import { useSettingsActions } from "./store/settings-actions";
import { useCurrentWorkspace } from "../workspaces/hooks/use-workspace";
import { useUpdateWorkspaceMutation } from "../workspaces/store/workspace-api";
import { useSettings } from "./hooks/use-settings";

export default function WorkspaceSettings() {
  const currentWorkspace = useCurrentWorkspace();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [update] = useUpdateWorkspaceMutation();
  const { t: tW } = useTranslation("translation", {
    keyPrefix: "sidebar.workspace",
  });
  const { t, i18n } = useTranslation();
  const save = async (w: WorkspaceDTO) => {
    update(w);
    setEditDialogOpen(false);
  };
  const settings = useSettings();
  const exporter = useWorkspaceExport();
  const backup = useBackup();
  const { updateSettings } = useSettingsActions();
  const handleUpdateCheck = (val: boolean) => {
    updateSettings({ client: { autoUpdateCheck: val } });
  };

  const setIndentSize = (val: number) => {
    updateSettings({ editor: { codeIndentSize: val } });
  };

  return (
    <div className="w-full flex flex-col items-center pt-3 gap-4">
      {currentWorkspace && (
        <SettingsCard>
          <div className="flex gap-4">
            <WorkspaceIcon
              className="size-16 rounded-md text-3xl"
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
              variant={i18n.language == "en" ? "default" : "secondary"}
            >
              English
            </Button>
            <Button
              onClick={() => i18n.changeLanguage("tr")}
              variant={i18n.language == "tr" ? "default" : "secondary"}
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
          <div className="flex flex-col gap-1">
            <Label htmlFor="indent-size-input">
              {t("settings.workspace.codeBlockIndentSize")}
            </Label>
            <p className="text-sm text-foreground/70">
              {t("settings.workspace.codeBlockIndentSizeDescription")}
            </p>
          </div>
          <Input
            type="number"
            className="w-fit max-w-16 bg-secondary border-none top-highlight"
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val) && val > 0) {
                setIndentSize(val);
              }
            }}
            value={settings.editor.codeIndentSize}
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
