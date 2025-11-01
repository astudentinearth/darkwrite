import { DarkwriteAPIClient } from "@/api/api-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { ArchiveRestore, FileArchive } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function RestoreDataDialog() {
  const [path, setPath] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const { t } = useTranslation(undefined, { keyPrefix: "settings.workspace" });
  const restore = () => {
    if (!path) return;
    setPending(true);
    DarkwriteAPIClient.backup.restoreBackup(path).finally(() => {
      setPending(false);
    });
  };
  const chooseFile = async () => {
    const filename = await DarkwriteAPIClient.backup.chooseArchive();
    setPath(filename);
  };
  return (
    <AlertDialog
      onOpenChange={() => {
        setPath(null);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button
          variant={"secondary"}
          className="shrink-0 w-fit border border-border"
        >
          <span className="flex gap-2 items-center">
            <ArchiveRestore size={18} className="inline" />
            {t("restoreButton")}
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className={cn("p-4 max-w-120")}>
        <AlertDialogTitle>{t("restoreDialog.title")}</AlertDialogTitle>
        <AlertDialogDescription>
          {t("restoreDialog.description")}
          <strong>{t("restoreDialog.warningText")}</strong>
        </AlertDialogDescription>
        <Button
          onClick={chooseFile}
          variant={"secondary"}
          className={cn(
            "overflow-hidden border border-border",
            path && "grid grid-cols-[18px_auto] gap-2 text-start justify-start",
          )}
        >
          {path ? (
            <>
              <FileArchive size={18} />
              <span className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
                {path}
              </span>
            </>
          ) : (
            t("restoreDialog.chooseFile")
          )}
        </Button>
        <AlertDialogFooter className="flex flex-row">
          <AlertDialogCancel disabled={pending}>
            {t("restoreDialog.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={pending || path == null}
            onClick={() => {
              if (path) restore();
            }}
            className="bg-transparent border-destructive border text-foreground hover:bg-destructive hover:text-destructive-foreground"
          >
            {t("restoreDialog.restore")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
