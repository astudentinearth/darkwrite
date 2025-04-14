import React from "react";
import ToastBase from "./toast-base";
import { useTranslation } from "react-i18next";
import { ArrowUpRightFromSquare } from "lucide-react";

export function UpdateToast({
  url,
  version,
}: {
  url: string;
  version: string;
}) {
  const { t } = useTranslation(undefined, { keyPrefix: "toast" });

  return (
    <ToastBase>
      <span className="shrink-0 p-2 pb-0">
        {t("update.description", { version })}
      </span>
      <a
        href={url}
        target="_blank"
        className="p-2 pt-0 flex shrink-0 items-center gap-1.5 text-primary-text rounded-md hover:underline"
      >
        <ArrowUpRightFromSquare size={18} />
        {t("update.releasePageButton")}
      </a>
    </ToastBase>
  );
}

export function UpToDateToast() {
  const { t } = useTranslation(undefined, { keyPrefix: "toast" });
  
  return (
    <ToastBase>
      <span className="p-2">{t("update.upToDate")}</span>
    </ToastBase>
  );
}
