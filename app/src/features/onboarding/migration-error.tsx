import { HeartCrack } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function MigrationError() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center">
      <HeartCrack className="size-18" />
      <div className="h-5" />
      <div className="text-center text-[32px} font-semibold">
        {t("onboarding.migrationError")}
      </div>
      <div className="h-4"></div>
      <div className="text-xl text-center max-w-100">
        {t("onboarding.migrationErrorDesc1")}
      </div>
      <div className="text-xl text-center flex flex-col justify-center max-w-100 mt-3">
        {t("onboarding.migrationErrorDesc2")}
        <a
          className="text-primary-text inline-block"
          target="_blank"
          href="https://github.com/astudentinearth/darkwrite/releases/tag/v0.5.3-alpha.2"
        >
          {t("onboarding.latestAlpha")}
        </a>
      </div>
      <div className="h-6"></div>
    </div>
  );
}
