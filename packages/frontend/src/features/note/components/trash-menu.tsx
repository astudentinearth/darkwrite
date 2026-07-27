import { Menu, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { useAppDispatch } from "@/features/store/hooks";
import { ClearTrashDialogPortal } from "../store/notes-ui-actions";

export function TrashMenu() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="w-9 h-9 p-0 shrink-0">
          <Menu className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border-border border bg-secondary/25"
      >
        <DropdownMenuItem
          onSelect={() => {
            ClearTrashDialogPortal(dispatch).showClearTrashDialog();
          }}
          variant="destructive"
        >
          <Trash2 className="size-4 mr-2" />
          {t("sidebar.trash.empty")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
