import { Label, Switch } from '@darkwrite/ui'
import { produceUserSettings, useSettingsStore } from '@renderer/context/settings-store'
import React from 'react'
import { useTranslation } from 'react-i18next';

export default function UpdateToggle() {
  const option = useSettingsStore(s => s.settings.updateCheckEnabled);
  const setUpdateCheckEnabled = (val: boolean) => produceUserSettings(d => {d.updateCheckEnabled = val})
  const { t } = useTranslation(undefined, {keyPrefix: "settings.privacy"});
  return (
    <div className="p-4 bg-view-2 rounded-2xl grid grid-cols-[1fr_auto] items-center auto-rows-auto gap-4 border border-border/50">
      <Label htmlFor="update-check-toggle">
        {t("autoUpdateCheckLabel")}
      </Label>
      <Switch
        checked={option}
        onCheckedChange={setUpdateCheckEnabled}
        className="place-self-end"
        id="update-check-toggle"
      />
    </div>
  
  )
}
