import { useTranslation } from "react-i18next";
import ToastContainer from "../notifications/components/base-toast";
import { Save } from "lucide-react";
import { Button } from "@/components/ui";
import { DarkwriteAPIClient } from "@/api/api-client";
import notify from "../notifications/notify";

export type ExportToastProps = {
  path?: string;
};

// eslint-disable-next-line react-refresh/only-export-components
function ExportToast(props: ExportToastProps) {
  const { t } = useTranslation();
  return (
    <ToastContainer className="flex items-center gap-2 pr-4 pl-4">
      <Save size={18} />
      <span>{t("toast.exportPage.success")}</span>
      {window.isElectron && props.path && (
        <Button
          onClick={() => {
            if (props.path)
              DarkwriteAPIClient.desktop.shell.showItemInFolder(props.path);
          }}
          variant="link"
          className="p-0 text-primary-text h-fit"
        >
          {t("ui.showInFolder")}
        </Button>
      )}
    </ToastContainer>
  );
}

export function showExportToast(path?: string) {
  notify.custom(<ExportToast path={path} />);
}
