import { BackButton } from "./onboarding-button";
import OnboardingPageRoot from "./onboarding-page-root";
import { getOnboardingPage, useOnboardingState } from "./onboarding-state";

export default function Onboarding() {
  const page = useOnboardingState((state) => state.currentPage);
  const previousPage = useOnboardingState((s) => s.previousPage);
  const goBack = useOnboardingState((s) => s.goBack);

  return (
    <OnboardingPageRoot className="*:slide-up-and-fade-in">
      {previousPage && (
        <BackButton onClick={goBack} className="absolute left-5 top-5" />
      )}
      {getOnboardingPage(page)}
    </OnboardingPageRoot>
  );
}
