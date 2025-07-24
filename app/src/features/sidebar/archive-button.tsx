import { Archive } from "lucide-react";
import { SidebarItem } from "./sidebar-item";

export function ArchiveButton() {
  return <SidebarItem>
    <Archive size={16} />
    <span>Archive</span>
  </SidebarItem>
}