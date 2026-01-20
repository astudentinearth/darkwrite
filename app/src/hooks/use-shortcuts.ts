import { toggleSidebar } from "@/context/local-state";
import { showSearch } from "@/features/search/search-state";
import { useEffect } from "react";

export const useShortcuts = () => {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const cmd = (key: string) => {
        return e.key === key && (e.metaKey || e.ctrlKey);
      };
      const alt = (key: string) => {
        return e.key === key && e.altKey;
      };
      if (cmd("n")) {
        e.preventDefault();
      } else if (cmd("k")) {
        showSearch();
      } else if (alt("b")) {
        toggleSidebar();
      } else if (alt("ArrowLeft")) {
        window.history.back();
      } else if (alt("ArrowRight")) {
        window.history.forward();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
    // we'll get rid of react query.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
