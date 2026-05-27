import { Home, Notebook, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { navigateHome } from "../navigation/navigator";
import SettingsDialog from "../settings/settings-dialog";
import { SidebarItem } from "./sidebar-item";

export function SidebarNavigation() {
  const { t } = useTranslation(undefined, { keyPrefix: "sidebar.button" });
  const route = useLocation();
  const isHome = route.pathname === "/";
  return (
    <div className="flex flex-col gap-0.5">
      <SidebarItem
        onClick={() => !isHome && navigateHome()}
        className={cn(isHome && "bg-secondary/20")}
      >
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
