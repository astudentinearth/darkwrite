import { IOnboardingAPI } from "@darkwrite/common";
import { pathExists, readFileUtf8, writeFileUtf8 } from "./fs";
import { handler, HandlerImplements } from "@/types";

export const CURRENT_VERSION = "v1";

export function OnboardingService(
  onboardSentinel: string,
  versionSentinel: string,
) {
  const isNewUser = () => pathExists(onboardSentinel).map((t) => !t);

  const markOnboardingCompleted = () =>
    writeFileUtf8(onboardSentinel, "onboarded");

  const hasMigratedToVersion = (version: string) =>
    readFileUtf8(versionSentinel)
      .map((s) => s.trim())
      .map((v) => v === version);

  const markVersionMigrated = (v: string) => writeFileUtf8(versionSentinel, v);

  const hasMigratedToCurrentVersion = () =>
    hasMigratedToVersion(CURRENT_VERSION);

  const ipcHandlers: HandlerImplements<IOnboardingAPI> = {
    isNewUser: handler(isNewUser),
    markFinished: handler(markOnboardingCompleted),
  };

  return {
    isNewUser,
    markVersionMigrated,
    markOnboardingCompleted,
    hasMigratedToVersion,
    hasMigratedToCurrentVersion,
    ipcHandlers,
  };
}
