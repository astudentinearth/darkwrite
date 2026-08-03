import type { RootState } from "@/features/store/types";

export const selectClientInfo = (state: RootState) => state.client.info;

export const selectUpdateData = (state: RootState) => state.client.update.data;

export const selectUpdateStatus = (state: RootState) =>
  state.client.update.status;
