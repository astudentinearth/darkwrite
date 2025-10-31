import { Input } from "@/components/ui";
import { ForwardButton } from "./onboarding-button";
import { useOnboardingState } from "./onboarding-state";
import { useTranslation } from "react-i18next";

export default function WorkspaceNameStep() {
  const name = useOnboardingState((s) => s.workspaceName);
  const setName = useOnboardingState((s) => s.setWorkspaceName);
  const canContinue = name.trim().length > 0;
  const goToPage = useOnboardingState((s) => s.goToPage);
  const _continue = () => {
    goToPage("theme");
  };
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center">
      <img src="/darkwrite_icon.png" className="w-30 h-30 drop-shadow-xl"></img>
      <div className="h-5" />
      <div className="text-center text-[32px} font-semibold">
        {t("onboarding.welcome")}
      </div>
      <div className="h-4"></div>
      <div className="text-xl text-center">{t("onboarding.welcomeDesc")}</div>
      <div className="h-6"></div>
      <div className="flex gap-3">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("onboarding.nameWorkspaceHint")}
          className="px-4 h-14 text-xl! bg-view-2 w-70 rounded-2xl"
        />
        <ForwardButton onClick={_continue} disabled={!canContinue} />
      </div>
    </div>
  );
}
