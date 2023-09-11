import { useTranslation } from "react-i18next";
import { SidebarView } from "../SidebarView";

export function SettingsSidebarView(){
    const {t} = useTranslation();
    return <SidebarView>
        <h1 className="text-title">{t("sidebar.views.settings.title")}</h1>
    </SidebarView>
}