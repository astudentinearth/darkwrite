import type {
  DarkwriteDesktopClientInfo,
  UpdateServerResponse,
} from "@darkwrite/common";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UpdateStatus = "idle" | "loading" | "error";

export type ClientSlice = {
  /** Immutable desktop client facts, loaded on demand (About screen). */
  info?: DarkwriteDesktopClientInfo;
  update: {
    data?: UpdateServerResponse;
    status: UpdateStatus;
  };
};

export const CLIENT_SLICE_NAME = "client";

const initialState: ClientSlice = {
  info: undefined,
  update: { data: undefined, status: "idle" },
};

export const clientSlice = createSlice({
  name: CLIENT_SLICE_NAME,
  initialState,
  reducers: {
    setClientInfo(state, action: PayloadAction<DarkwriteDesktopClientInfo>) {
      state.info = action.payload;
    },
    setUpdate(
      state,
      action: PayloadAction<{
        data: UpdateServerResponse | undefined;
        status: UpdateStatus;
      }>,
    ) {
      state.update.data = action.payload.data;
      state.update.status = action.payload.status;
    },
    setUpdateStatus(state, action: PayloadAction<UpdateStatus>) {
      state.update.status = action.payload;
    },
  },
});
