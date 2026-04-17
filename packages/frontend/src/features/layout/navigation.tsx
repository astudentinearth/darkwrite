import { HeaderbarButton } from "@/components/headerbar-button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { goBack, goForward } from "../navigation/navigator";

export function HistoryNavigation() {
  // check if we can go forward
  const location = useLocation();
  const [canGoForward, setCanGoForward] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  useEffect(() => {
    console.log(window.history);
    setCanGoForward(window.history.length > window.history.state.idx + 1);
    setCanGoBack(0 < window.history.state.idx && window.history.length > 0);
  }, [location]);

  return (
    <>
      <HeaderbarButton
        disabled={!canGoBack}
        className="disabled:opacity-20"
        title="Back"
        onClick={goBack}
      >
        <ArrowLeft size={18} />
      </HeaderbarButton>
      <HeaderbarButton
        disabled={!canGoForward}
        className="disabled:opacity-20"
        title="Forward"
        onClick={goForward}
      >
        <ArrowRight size={18} />
      </HeaderbarButton>
    </>
  );
}
