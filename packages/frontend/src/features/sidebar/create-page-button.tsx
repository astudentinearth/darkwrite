import { cn } from "@/lib/utils";
import { SquarePen } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { useTranslation } from "react-i18next";
import { useCreateNoteMutation } from "../note/store/create-note";
import { useCurrentWorkspaceId } from "../workspaces/hooks/use-workspace";

export function CreatePageButton(props: { className?: string }) {
  const [create] = useCreateNoteMutation();
  const workspaceId = useCurrentWorkspaceId();
  const { t } = useTranslation();
  if (!workspaceId) return null;

  const handleClick = async () =>
    create({
      navigateAfter: true,
      parentId: null,
      workspaceId,
    });
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
