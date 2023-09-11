import { useTranslation } from "react-i18next";
import { SidebarView } from "../SidebarView";

export function TasksView(){
    const {t} = useTranslation();
    return <SidebarView>
        <h1 className="text-title">{t("sidebar.views.todos.title")}</h1>
    </SidebarView>
}