import type { RootState } from "@/features/store/types";

export function selectDatabaseViewById(state: RootState, id: string) {
  return state.databaseView.entities[id] ?? null;
}
