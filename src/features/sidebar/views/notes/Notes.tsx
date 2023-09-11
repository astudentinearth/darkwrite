import { useTranslation } from "react-i18next";
import { SidebarView } from "../SidebarView";

export function NotesView(){
    const {t} = useTranslation();
    return <SidebarView>
        <h1 className="text-title">{t("sidebar.views.notes.title")}</h1>
    </SidebarView>
}