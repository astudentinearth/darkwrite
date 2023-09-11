import { useTranslation } from "react-i18next";
import { SidebarView } from "../SidebarView";

export function NotebooksView(){
    const {t} = useTranslation();
    return <SidebarView>
        <h1 className="text-title">{t("sidebar.views.notebooks.title")}</h1>
    </SidebarView>
}