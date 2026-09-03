import type { PageSize } from "@darkwrite/common";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_WIDTH } from "@/features/layout/sidebar-metrics";

// this store is to persist unimportant stuff in localstorage

type localStore = {
  isSidebarCollapsed: boolean;
  sidebarWidth: number;
  route: string;
  useSpellcheck: boolean;
  alwaysShowWordCount: boolean;
  lastUpdateCheck: string;
  pdfExportPageSize: PageSize;
};

type localStoreAction = {
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarWidth: (width: number) => void;
  setRoute: (r: string) => void;
  setSpellcheck: (val: boolean) => void;
  setAlwaysShowWordCount: (val: boolean) => void;
  setLastUpdateCheckTimestamp: (val: Date) => void;
  setPdfExportPageSize: (size: PageSize) => void;
};

export const useLocalStore = create<localStore & localStoreAction>()(
  persist<localStore & localStoreAction>(
    (set) => ({
      isSidebarCollapsed: false,
      sidebarWidth: DEFAULT_WIDTH,
      route: "/",
      useSpellcheck: true,
      allNotesCollapsed: false,
      favoritesCollapsed: false,
      alwaysShowWordCount: false,
      lastUpdateCheck: "1970-01-01T00:00:00.000Z",
      pdfExportPageSize: "A4",
      setSidebarCollapsed: (collapsed: boolean) =>
        set({ isSidebarCollapsed: collapsed }),
      setSidebarWidth: (width: number) => set({ sidebarWidth: width }),
      setRoute: (r: string) => set({ route: r }),
      setSpellcheck: (useSpellcheck) => set({ useSpellcheck }),
      setAlwaysShowWordCount: (val) => set({ alwaysShowWordCount: val }),
      setLastUpdateCheckTimestamp: (val) =>
        set({ lastUpdateCheck: val.toISOString() }),
      setPdfExportPageSize: (pdfExportPageSize) => set({ pdfExportPageSize }),
    }),
    {
      name: "local-state",
    },
  ),
);

export function toggleSidebar() {
  useLocalStore.setState((state) => ({
    isSidebarCollapsed: !state.isSidebarCollapsed,
  }));
}
