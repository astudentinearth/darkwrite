import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogContent,
  Button,
} from "@/components/ui";
import { useClearTrashDialog } from "../hooks/use-trash-dialog";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export function ClearTrashDialog() {
  const { isLoading, hideClearTrashDialog, open, clearTrash } =
    useClearTrashDialog();
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
            disabled={isLoading}
            className="w-1/2"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={clearTrash}
            disabled={isLoading}
            variant="destructive"
            className={cn("w-1/2", isLoading && "animate-pulse")}
          >
            {t("clear")}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
