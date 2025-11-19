import { useLocalStore } from "@/context/local-state";
import { useSettings } from "@/query/use-settings";
import React, { useEffect } from "react";
import { useUpdate } from "./use-update";

export default function UpdateChecker() {
  const { data: settings, isFetched } = useSettings();
  const enabled = settings.client.autoUpdateCheck;
  const settingsInitialized = isFetched;
  const lastCheck = useLocalStore((l) => l.lastUpdateCheck);
  const update = useUpdate();
  const setLastCheck = useLocalStore((l) => l.setLastUpdateCheckTimestamp);

  useEffect(() => {
    if (!settingsInitialized) return;
    if (!enabled) return;
    if (Date.now() - new Date(lastCheck).valueOf() < 1000 * 60 * 60) return;
    update.refetch();
    setLastCheck(new Date());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, lastCheck, settingsInitialized, update]);

  return <></>;
}
