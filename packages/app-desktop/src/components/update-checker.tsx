import { useLocalStore } from '@/context/local-state';
import { useSettingsStore } from '@/context/settings-store'
import { useUpdate } from '@/hooks/query/use-update';
import React, { useEffect } from 'react'

export default function UpdateChecker() {
  const enabled = useSettingsStore(s => s.settings.updateCheckEnabled);
  const settingsInitialized = useSettingsStore(s => s.initialized);
  const lastCheck = useLocalStore(l => l.lastUpdateCheck);
  const update = useUpdate();
  const setLastCheck = useLocalStore(l => l.setLastUpdateCheckTimestamp);

  useEffect(() => {
    if(!settingsInitialized) return;
    if(!enabled) return;
    console.log(Date.now() - new Date(lastCheck).valueOf())
    if(Date.now() - new Date(lastCheck).valueOf() < 1000 * 60 * 60) return;
    update.refetch();
    setLastCheck(new Date());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, lastCheck, settingsInitialized, update])

  return <></>
}
