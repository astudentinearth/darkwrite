import { Home, Notebook, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SidebarItem } from "./sidebar-item";

export function SidebarNavigation() {
  const { t } = useTranslation(undefined, { keyPrefix: "sidebar.button" });

  return (
    <div className="flex flex-col gap-0.5">
      <SidebarItem>
        <Home size={16} />
        <span>{t("home")}</span>
      </SidebarItem>
      <SidebarItem>
        <Notebook size={16} />
        <span>{"Journal"}</span>
      </SidebarItem>
      <SidebarItem>
        <Settings size={16} />
        <span>{t("settings")}</span>
      </SidebarItem>
    </div>
  );
}
