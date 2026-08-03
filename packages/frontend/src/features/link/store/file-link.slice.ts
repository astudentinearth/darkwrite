import type { FileLinkMetadata } from "@darkwrite/common";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/features/store/types";

export const fileLinkAdapter = createEntityAdapter<FileLinkMetadata>();

export const fileLinkSlice = createSlice({
  name: "linkedFile",
  initialState: fileLinkAdapter.getInitialState(),
  reducers: {
    setAllLinkedFiles: fileLinkAdapter.setAll,
    upsertLinkedFiles: fileLinkAdapter.upsertMany,
  },
});

export const { setAllLinkedFiles, upsertLinkedFiles } = fileLinkSlice.actions;
