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
};

type localStoreAction = {
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarWidth: (width: number) => void;
  setRoute: (r: string) => void;
  setCalculatedWidth: (change: number) => void;
  setSpellcheck: (val: boolean) => void;
};

export const useLocalStore = create<localStore & localStoreAction>()(
  persist<localStore & localStoreAction>(
    (set) => ({
      isSidebarCollapsed: false,
      sidebarWidth: 240,
      route: "/",
      useSpellcheck: true,
      setSidebarCollapsed: (collapsed: boolean) =>
        set({ isSidebarCollapsed: collapsed }),
      setSidebarWidth: (width: number) => set({ sidebarWidth: width }),
      setRoute: (r: string) => set({ route: r }),
      setCalculatedWidth: (change: number) =>
        set((state) => ({
          sidebarWidth: calculateWidth(state.sidebarWidth, change),
        })),
      setSpellcheck: (useSpellcheck) => set({ useSpellcheck }),
    }),
    {
      name: "local-state",
    },
  ),
);
