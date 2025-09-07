import { Home, Notebook, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SidebarItem } from "./sidebar-item";
import { useNavigate } from "react-router-dom";
import SettingsDialog from "../settings/settings-dialog";

export function SidebarNavigation() {
  const { t } = useTranslation(undefined, { keyPrefix: "sidebar.button" });
  const nav = useNavigate();
  return (
    <div className="flex flex-col gap-0.5">
      <SidebarItem onClick={() => nav("/")}>
        <Home size={16} />
        <span>{t("home")}</span>
      </SidebarItem>
      <SidebarItem className="hidden">
        <Notebook size={16} />
        <span>{"Journal"}</span>
      </SidebarItem>
      <SettingsDialog>
        <SidebarItem>
          <Settings size={16} />
          <span>{t("settings")}</span>
        </SidebarItem>
      </SettingsDialog>
    </div>
  );
}
