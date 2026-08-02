import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  Button,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { useClearTrashDialog } from "../hooks/use-trash-dialog";

export function ClearTrashDialog() {
  const { hideClearTrashDialog, open, clearTrash } = useClearTrashDialog();
  const { t } = useTranslation("translation", {
    keyPrefix: "ui.clearTrashDialog",
  });

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-96!">
        <AlertDialogTitle>{t("title")}</AlertDialogTitle>
        <AlertDialogDescription>{t("description")}</AlertDialogDescription>
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              hideClearTrashDialog();
            }}
            className="w-1/2"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={clearTrash}
            variant="destructive"
            className={cn("w-1/2")}
          >
            {t("clear")}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
