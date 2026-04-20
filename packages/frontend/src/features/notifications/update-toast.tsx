import { ArrowUpRightFromSquare, Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import ToastContainer from "./components/base-toast";

interface UpdateToastProps {
  version: string;
  href: string;
}

export default function UpdateToast({ version, href }: UpdateToastProps) {
  const { t } = useTranslation();
  return (
    <ToastContainer className="relative text-star items-center rounded-2xl gap-2 w-108 flex border-star/50">
      <div className="absolute inset-0 rounded-[inherit] shrink-0 pointer-events-none bg-star/20" />
      <Download size={16} className="shrink-0" />
      <span className="shrink-0">
        {t("toast.update.description", { version })}
      </span>
      <div className="grow"></div>
      <a
        className="flex items-center gap-2 text-primary-text hover:underline shrink-0 whitespace-nowrap"
        target="_blank"
        href={href}
      >
        <ArrowUpRightFromSquare size={18} className="shrink-0" />
        {t("toast.update.releasePageButton")}
      </a>
    </ToastContainer>
  );
}
