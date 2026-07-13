import { type DatabaseViewMeta, DatabaseViewType } from "@darkwrite/common";
import React from "react";

export interface IDatabaseViewContext {
  viewId: string;
  databaseId: string;
  viewMeta: DatabaseViewMeta;
}

export const DatabaseViewContext = React.createContext<IDatabaseViewContext>({
  viewId: "",
  databaseId: "",
  viewMeta: { id: "", type: DatabaseViewType.Table },
});
