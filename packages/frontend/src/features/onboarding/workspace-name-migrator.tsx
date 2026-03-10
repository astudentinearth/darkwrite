import { Input } from "@/components/ui";
import { ForwardButton } from "./onboarding-button";
import { useOnboardingState } from "./onboarding-state";
import { useTranslation } from "react-i18next";
import { HeartHandshake } from "lucide-react";

export default function WorkspaceNameMigratorStep() {
  const name = useOnboardingState((s) => s.workspaceName);
  const setName = useOnboardingState((s) => s.setWorkspaceName);
  const canContinue = name.trim().length > 0;
  const goToPage = useOnboardingState((s) => s.goToPage);
  const _continue = () => {
    goToPage("finish-migrator");
  };
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center">
      <HeartHandshake className="size-18" />
      <div className="h-5" />
      <div className="text-center text-[32px} font-semibold">
        {t("onboarding.alphaTitle")}
      </div>
      <div className="h-4"></div>
      <div className="text-xl text-center">{t("onboarding.alphaDesc")}</div>
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
