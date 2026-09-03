import { useLocalStore } from "@/context/local-state";

export const useSidebar = () => {
  const width = useLocalStore((state) => state.sidebarWidth);
  const setWidth = useLocalStore((state) => state.setSidebarWidth);
  const isSidebarCollapsed = useLocalStore((state) => state.isSidebarCollapsed);
  const setSidebarCollapsed = useLocalStore(
    (state) => state.setSidebarCollapsed,
  );
  return { width, setWidth, isSidebarCollapsed, setSidebarCollapsed };
};
