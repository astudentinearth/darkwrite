import { Button, Input } from "@/components/ui";
import { ForwardButton } from "./onboarding-button";
import { useOnboardingState } from "./onboarding-state";

export default function WorkspaceNameStep() {
  const name = useOnboardingState((s) => s.workspaceName);
  const setName = useOnboardingState((s) => s.setWorkspaceName);
  const canContinue = name.trim().length > 0;
  return (
    <div className="flex flex-col items-center">
      <img src="/darkwrite_icon.png" className="w-30 h-30 drop-shadow-xl"></img>
      <div className="h-5" />
      <div className="text-center text-[32px} font-semibold">
        Welcome to Darkwrite
      </div>
      <div className="h-4"></div>
      <div className="text-xl text-center">
        Let's create your first workspace
      </div>
      <div className="h-6"></div>
      <div className="flex gap-3">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name your workspace"
          className="px-4 h-14 text-xl! bg-view-2 w-70 rounded-2xl"
        />
        <ForwardButton disabled={!canContinue} />
      </div>
    </div>
  );
}
