import { ArrowUpRightFromSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

interface UpdateToastProps {
  version: string;
  href: string;
}

export default function UpdateToast({ version, href }: UpdateToastProps) {
  const { t } = useTranslation();
  return (
    <div className="flex w-full justify-between items-center">
      {t("toast.update.description", { version })}
      <a
        className="flex items-center gap-2 text-primary-text hover:underline"
        target="_blank"
        href={href}
      >
        <ArrowUpRightFromSquare size={18} />
        {t("toast.update.releasePageButton")}
      </a>
    </div>
  );
}
