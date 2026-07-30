import { SquarePen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/features/store/hooks";
import { cn } from "@/lib/utils";
import { createNote } from "../note/store/note.thunk";
import { useCurrentWorkspaceId } from "../workspaces/hooks/use-workspace";
import { SidebarItem } from "./sidebar-item";

export function CreatePageButton(props: { className?: string }) {
  const dispatch = useAppDispatch();
  const workspaceId = useCurrentWorkspaceId();
  const { t } = useTranslation();
  if (!workspaceId) return null;

  const handleClick = () => {
    dispatch(createNote({ navigateAfter: true, parentId: null }));
  };
  return (
    <SidebarItem
      onClick={handleClick}
      className={cn(
        //"p-1.5 w-8 h-8 bg-view-2 rounded-[8px] text-white/80 hover:text-white text-foreground shrink-0",
        props.className,
      )}
    >
      <SquarePen size={18} />
      {t("sidebar.button.newPage")}
    </SidebarItem>
  );
}
