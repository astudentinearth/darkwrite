import { Languages } from "lucide-react";
import OnboardingButton from "./onboarding-button";
import { useOnboardingState } from "./onboarding-state";
import { useTranslation } from "react-i18next";

export default function LanguageSelection() {
  const setPage = useOnboardingState((s) => s.goToPage);
  const { i18n, t } = useTranslation();

  const _continue = (lang: string) => {
    i18n.changeLanguage(lang);
    setPage("workspace-name");
  };

  return (
    <div className="flex flex-col items-center slide-up-and-fade-in">
      <img src="darkwrite_icon.png" className="w-30 h-30 drop-shadow-xl"></img>
      <div className="h-10" />
      <div className="flex gap-2 items-center">
        <Languages size={24} />
        {t("onboarding.chooseLanguage")}
      </div>
      <div className="h-8" />
      <OnboardingButton onClick={() => _continue("en")} className="w-45">
        English
      </OnboardingButton>
      <div className="h-2" />
      <OnboardingButton onClick={() => _continue("tr")} className="w-45">
        Türkçe
      </OnboardingButton>
    </div>
  );
}
