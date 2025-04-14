import { HeaderbarButton } from "@renderer/components/ui/headerbar-button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function HistoryNavigation(){
  // check if we can go forward
  const location = useLocation();
  const [canGoForward, setCanGoForward] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  useEffect(()=>{
    setCanGoForward(window.history.length > window.history.state.idx + 1);
    setCanGoBack((0 < window.history.state.idx) && window.history.length > 0);
  }, [location]);

  return <>
    <HeaderbarButton disabled={!canGoBack} className="disabled:opacity-20" title="Back" onClick={() => window.history.back()}>
      <ChevronLeft size={20}/>
    </HeaderbarButton>
    {canGoForward && <HeaderbarButton title="Forward" onClick={() => window.history.forward()}>
      <ChevronRight size={20}/>
    </HeaderbarButton>}
  </>
}