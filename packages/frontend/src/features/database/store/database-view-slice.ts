import type { DatabaseViewMeta } from "@darkwrite/common";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const databaseViewAdapter = createEntityAdapter<DatabaseViewMeta>({});

export const databaseViewSlice = createSlice({
  name: "databaseView",
  initialState: databaseViewAdapter.getInitialState(),
  reducers: {
    upsertViews: databaseViewAdapter.upsertMany,
    upsertView: databaseViewAdapter.upsertOne,
    removeViews: databaseViewAdapter.removeMany,
    removeView: databaseViewAdapter.removeOne,
  },
});

export const { removeView, upsertView, upsertViews, removeViews } =
  databaseViewSlice.actions;
