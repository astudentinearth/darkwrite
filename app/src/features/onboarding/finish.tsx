import * as React from "react";
import { useTranslation } from "react-i18next";
import OnboardingButton from "./onboarding-button";
import { finishOnboarding } from "./onboarding-state";

export default function OnboardingFinish() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center">
      <img src="/darkwrite_icon.png" className="w-30 h-30 drop-shadow-xl"></img>
      <div className="h-5" />
      <div className="text-center text-[32px} font-semibold">
        {t("onboarding.finishedHeading")}
      </div>
      <div className="h-4"></div>
      <div className="text-xl text-center max-w-100">
        {t("onboarding.finishedDesc")}
      </div>
      <div className="h-6"></div>
      <OnboardingButton
        onClick={finishOnboarding}
        variant="default"
        className="bg-primary border-primary"
      >
        {t("onboarding.letsBegin")}
      </OnboardingButton>
    </div>
  );
}
