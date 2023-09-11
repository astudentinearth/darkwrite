import { useTranslation } from "react-i18next";
import { SidebarView } from "../SidebarView";

export function SearchView(){
    const {t} = useTranslation();
    return <SidebarView>
        <h1 className="text-title">{t("sidebar.views.search.title")}</h1>
    </SidebarView>
}