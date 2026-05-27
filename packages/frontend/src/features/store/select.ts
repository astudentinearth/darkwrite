import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./types";

const createAppSelector = createSelector.withTypes<RootState>();
export default createAppSelector;
