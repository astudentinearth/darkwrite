import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./types";

const createAppSelector = createSelector.withTypes<RootState>();
export default createAppSelector;
