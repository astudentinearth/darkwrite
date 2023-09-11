import { useTranslation } from "react-i18next";
import { SidebarView } from "../SidebarView";

export function TagsView(){
    const {t} = useTranslation();
    return <SidebarView>
        <h1 className="text-title">{t("sidebar.views.tags.title")}</h1>
    </SidebarView>
}