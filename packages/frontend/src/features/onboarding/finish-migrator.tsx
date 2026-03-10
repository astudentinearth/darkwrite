import { HeartHandshake } from "lucide-react";
import { useTranslation } from "react-i18next";
import OnboardingButton from "./onboarding-button";
import { migrateAndFinishOnboarding } from "./onboarding-state";
import { useState } from "react";

export default function MigrationFinish() {
  const { t } = useTranslation();
  const [working, isWorking] = useState(false);
  const finish = () => {
    isWorking(true);
    migrateAndFinishOnboarding().finally(() => {
      isWorking(false);
    });
  };
  return (
    <div className="flex flex-col items-center">
      <HeartHandshake className="size-18" />
      <div className="h-5" />
      <div className="text-center text-[32px} font-semibold">
        {t("onboarding.alphaTitle2")}
      </div>
      <div className="h-4"></div>
      <div className="text-xl text-center max-w-100">
        {t("onboarding.migrationDesc")}
      </div>
      <div className="h-6"></div>
      <OnboardingButton
        onClick={finish}
        variant="default"
        className="bg-primary border-primary"
        disabled={working}
      >
        {t("onboarding.letsBegin")}
      </OnboardingButton>
    </div>
  );
}
