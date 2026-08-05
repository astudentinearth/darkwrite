import { Home } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import TitlebarNavTrigger from "./titlebar-nav-trigger";

export default function PageTitle() {
  const pathname = useLocation().pathname;
  const { t } = useTranslation();
  switch (pathname) {
    case "/":
      return (
        <TitlebarNavTrigger>
          <>
            <Home size={18} />
            {t("sidebar.button.home")}
          </>
        </TitlebarNavTrigger>
      );
  }
  return null;
}
