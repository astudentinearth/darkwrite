import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useToast = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "toast" });
  return {
    showUpdateNotification(version: string, url: string) {
      console.log("showing notification")
      
      toast.custom(()=><div className="p-3 select-none drop-shadow-2xl bg-background border border-border rounded-xl flex flex-col gap-2">
        <span className="shrink-0 p-2">{t("update.description", { version })}</span>
        <a href={url} target="_blank" className="p-2 flex shrink-0 text-primary-text rounded-md hover:underline">{t("update.releasePageButton")}</a>
      </div>);
    },
  };
};
