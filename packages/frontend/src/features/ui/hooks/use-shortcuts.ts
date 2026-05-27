import { useEffect } from "react";
import { toggleSidebar } from "@/context/local-state";
import { showSearch } from "@/features/search/search-state";

export const useShortcuts = () => {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const cmd = (key: string) => {
        return e.key === key && (e.metaKey || e.ctrlKey);
      };
      const alt = (key: string) => {
        return e.key === key && e.altKey;
      };
      if (cmd("k")) {
        showSearch();
      } else if (alt("b")) {
        toggleSidebar();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
};
