import { useTranslation } from "react-i18next";
import { SidebarView } from "../SidebarView";

export function FavoritesView(){
    const {t} = useTranslation();
    return <SidebarView>
        <h1 className="text-title">{t("sidebar.views.favorites.title")}</h1>
        
    </SidebarView>
}