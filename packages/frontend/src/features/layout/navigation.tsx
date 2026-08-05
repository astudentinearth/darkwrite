import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { HeaderbarButton } from "@/components/headerbar-button";
import { TextTooltip } from "@/components/ui/tooltip";
import { goBack, goForward } from "../navigation/navigator";

export function HistoryNavigation() {
  // check if we can go forward
  const location = useLocation();
  const [canGoForward, setCanGoForward] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    setCanGoForward(window.history.length > window.history.state.idx + 1);
    setCanGoBack(0 < window.history.state.idx && window.history.length > 0);
  }, [location]);

  return (
    <>
      <TextTooltip text={t("ui.history.back")}>
        <HeaderbarButton
          disabled={!canGoBack}
          className="disabled:opacity-20"
          aria-label={t("ui.history.back")}
          onClick={goBack}
        >
          <IconArrowLeft size={18} />
        </HeaderbarButton>
      </TextTooltip>
      <TextTooltip text={t("ui.history.forward")}>
        <HeaderbarButton
          disabled={!canGoForward}
          className="disabled:opacity-20"
          aria-label={t("ui.history.forward")}
          onClick={goForward}
        >
          <IconArrowRight size={18} />
        </HeaderbarButton>
      </TextTooltip>
    </>
  );
}
