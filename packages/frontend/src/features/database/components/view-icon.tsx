import { DatabaseViewType } from "@darkwrite/common";
import { Calendar1, Kanban, LucideIcon, Table2 } from "lucide-react";
import React from "react";

export const viewIcons: Record<DatabaseViewType, LucideIcon> = {
  [DatabaseViewType.Table]: Table2,
  [DatabaseViewType.Board]: Kanban,
  [DatabaseViewType.Calendar]: Calendar1,
};

export function ViewIcon({
  type,
  ...props
}: { type: DatabaseViewType } & React.ComponentProps<LucideIcon>) {
  const Icon = viewIcons[type];

  return <Icon {...props} />;
}
