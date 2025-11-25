import { create } from "zustand";
import { persist } from "zustand/middleware";

// this store is to persist unimportant stuff in localstorage

const [MIN_WIDTH, MAX_WIDTH] = [180, 300];
const calculateWidth = (previous: number, change: number) =>
  previous + change > MAX_WIDTH || previous + change < MIN_WIDTH
    ? previous + change > MAX_WIDTH
      ? MAX_WIDTH
      : MIN_WIDTH
    : previous + change;

type localStore = {
  isSidebarCollapsed: boolean;
  sidebarWidth: number;
  route: string;
  useSpellcheck: boolean;
  allNotesCollapsed: boolean;
  favoritesCollapsed: boolean;
  alwaysShowWordCount: boolean;
  lastUpdateCheck: string;
  workspaceId: string;
};

type localStoreAction = {
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarWidth: (width: number) => void;
  setRoute: (r: string) => void;
  setCalculatedWidth: (change: number) => void;
  setSpellcheck: (val: boolean) => void;
  setAllNotesCollapsed: (val: boolean) => void;
  setFavoritesCollapsed: (val: boolean) => void;
  setAlwaysShowWordCount: (val: boolean) => void;
  setLastUpdateCheckTimestamp: (val: Date) => void;
  setWorkspaceId: (val: string) => void;
};

export const useLocalStore = create<localStore & localStoreAction>()(
  persist<localStore & localStoreAction>(
    (set) => ({
      isSidebarCollapsed: false,
      sidebarWidth: 240,
      route: "/",
      useSpellcheck: true,
      allNotesCollapsed: false,
      favoritesCollapsed: false,
      alwaysShowWordCount: false,
      lastUpdateCheck: "1970-01-01T00:00:00.000Z",
      workspaceId: "",
      setFavoritesCollapsed: (val) => set({ favoritesCollapsed: val }),
      setAllNotesCollapsed: (val) => set({ allNotesCollapsed: val }),
      setSidebarCollapsed: (collapsed: boolean) =>
        set({ isSidebarCollapsed: collapsed }),
      setSidebarWidth: (width: number) => set({ sidebarWidth: width }),
      setRoute: (r: string) => set({ route: r }),
      setCalculatedWidth: (change: number) =>
        set((state) => ({
          sidebarWidth: calculateWidth(state.sidebarWidth, change),
        })),
      setSpellcheck: (useSpellcheck) => set({ useSpellcheck }),
      setAlwaysShowWordCount: (val) => set({ alwaysShowWordCount: val }),
      setLastUpdateCheckTimestamp: (val) =>
        set({ lastUpdateCheck: val.toISOString() }),
      setWorkspaceId: (val) => set({ workspaceId: val }),
    }),
    {
      name: "local-state",
    },
  ),
);

export const setWorkspaceId = (id: string) => {
  useLocalStore.setState({ workspaceId: id });
};

export function toggleSidebar() {
  useLocalStore.setState((state) => ({
    isSidebarCollapsed: !state.isSidebarCollapsed,
  }));
}
