import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SidebarItem } from "./sidebar-item";
import { Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export function TrashWidget() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <SidebarItem>
            <Trash size={18} />
            <span>{t("sidebar.button.trash")}</span>
          </SidebarItem>
        </PopoverTrigger>
        <PopoverContent side="right" className="w-96 ml-2">
          <div>trash</div>
        </PopoverContent>
      </Popover>
    </>
  );
}
