import { IconEdit } from "@tabler/icons-react";
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
    <SidebarItem onClick={handleClick} className={cn(props.className)}>
      <IconEdit size={18} />
      {t("sidebar.button.newPage")}
    </SidebarItem>
  );
}
