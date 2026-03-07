import { create } from "zustand";

interface SearchState {
  open: boolean;
  query: string;
}

export const useSearchState = create<SearchState>()(() => ({
  open: false,
  query: "",
}));

export function showSearch(query = "") {
  useSearchState.setState({ open: true, query });
}

export function setSearchOpen(open: boolean) {
  useSearchState.setState({ open });
}

export function setSearchQuery(q: string) {
  useSearchState.setState({ query: q });
}
