import { BackButton } from "./onboarding-button";
import OnboardingPageRoot from "./onboarding-page-root";
import {
  getOnboardingPage,
  pageProgress,
  useOnboardingState,
} from "./onboarding-state";

export default function Onboarding() {
  const page = useOnboardingState((state) => state.currentPage);
  const previousPage = useOnboardingState((s) => s.previousPage);
  const goBack = useOnboardingState((s) => s.goBack);

  return (
    <OnboardingPageRoot
      progress={pageProgress[page]}
      className="*:slide-up-and-fade-in"
    >
      {previousPage && (
        <BackButton onClick={goBack} className="absolute left-2 top-2" />
      )}
      {getOnboardingPage(page)}
    </OnboardingPageRoot>
  );
}
