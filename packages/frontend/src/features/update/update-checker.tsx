import { useEffect } from "react";
import { useLocalStore } from "@/context/local-state";
import { useSettings } from "../settings/hooks/use-settings";
import { useUpdate } from "./use-update";

export default function UpdateChecker() {
  const enabled = useSettings().client.autoUpdateCheck;
  const lastCheck = useLocalStore((l) => l.lastUpdateCheck);
  const update = useUpdate();
  const setLastCheck = useLocalStore((l) => l.setLastUpdateCheckTimestamp);

  useEffect(() => {
    if (!enabled) return;
    if (Date.now() - new Date(lastCheck).valueOf() < 1000 * 60 * 60) return;
    update.refetch();
    setLastCheck(new Date());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, lastCheck, update]);

  return <></>;
}
