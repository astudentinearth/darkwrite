import type { Workspace } from "@darkwrite/common";
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
import { Button, Input, Label, Switch } from "@/components/ui";
import WorkspaceIcon from "@/components/workspace-icon";
import useBackup from "@/features/backup/hooks/use-backup";
import { useWorkspaceExport } from "@/features/workspaces/hooks/use-workspace-export";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useCurrentWorkspace } from "../workspaces/hooks/use-workspace";
import { updateWorkspace } from "../workspaces/store/workspace.thunk";
import { selectWorkspaceCount } from "../workspaces/store/workspace-selectors";
import { LanguageChooser } from "./components/language-chooser";
import { DeleteWorkspaceDialog } from "./delete-workspace-dialog";
import EditWorkspaceDialog from "./edit-workspace-dialog";
import { useSettings } from "./hooks/use-settings";
import { RestoreDataDialog } from "./restore-dialog";
import SettingsCard from "./settings-card";
import { useSettingsActions } from "./store/settings-actions";

export default function WorkspaceSettings() {
  const currentWorkspace = useCurrentWorkspace();
  const workspaceCount = useAppSelector((state) => selectWorkspaceCount(state));
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { t: tW } = useTranslation("translation", {
    keyPrefix: "sidebar.workspace",
  });
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const save = (w: Workspace) => {
    dispatch(updateWorkspace(w.id, w)).map(() => setEditDialogOpen(false));
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

  const toggleTextDirectionControls = (val: boolean) => {
    updateSettings({ editor: { showTextDirectionControls: val } });
  };

  const toggleOpenFilesOnDoubleClick = (val: boolean) => {
    updateSettings({ editor: { openFilesOnDoubleClick: val } });
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
          <div className="flex gap-2">
            <EditWorkspaceDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              workspace={currentWorkspace}
              onSave={save}
              key={`${currentWorkspace.id}:${editDialogOpen}`}
            >
              <Button variant={"secondary"} className="w-fit">
                <PenLine size={18} />
                {t("settings.workspace.editWorkspace")}
              </Button>
            </EditWorkspaceDialog>
            <DeleteWorkspaceDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
              workspace={currentWorkspace}
            >
              <Button
                variant={"destructive"}
                disabled={workspaceCount <= 1}
                className="w-fit bg-transparent"
              >
                {t("settings.workspace.deleteWorkspace")}
              </Button>
            </DeleteWorkspaceDialog>
          </div>
        </SettingsCard>
      )}
      <SettingsCard>
        <div className="flex justify-between items-center">
          <Label className="items-center flex gap-2">
            <Languages className="size-5" />
            {t("settings.workspace.languageText")}
          </Label>
          <LanguageChooser
            value={i18n.language}
            onValueChange={i18n.changeLanguage}
          />
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
              const val = parseInt(e.target.value, 10);
              if (!Number.isNaN(val) && val > 0) {
                setIndentSize(val);
              }
            }}
            value={settings.editor.codeIndentSize}
          />
        </div>
        <hr />
        <div className="flex justify-between items-center">
          <Label htmlFor="rtl-switch">
            {t("settings.workspace.showRtlControls")}
          </Label>
          <Switch
            id="rtl-switch"
            checked={settings.editor.showTextDirectionControls}
            onCheckedChange={toggleTextDirectionControls}
          />
        </div>
        <hr />
        <div className="flex justify-between items-center">
          <Label htmlFor="double-click-files-switch">
            {t("settings.workspace.openFilesOnDoubleClick")}
          </Label>
          <Switch
            id="double-click-files-switch"
            checked={settings.editor.openFilesOnDoubleClick}
            onCheckedChange={toggleOpenFilesOnDoubleClick}
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
