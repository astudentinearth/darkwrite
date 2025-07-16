import { useSettingsStore } from "@/context/settings-store";
import ExperimentalFeatures from "./experimental";
import FontSettings from "./fonts";
import { ThemeSettings } from "./themes";
import { WorkspaceSettings } from "./workspace";
import { AboutCard } from "./about";
import { useCenteredLayout } from "@/hooks/layout/use-centered-layout";
import { CSSProperties } from "react";
import UpdateToggle from "./update";

export function SettingsPage() {
  const initialized = useSettingsStore((s) => s.initialized);
  const width = useCenteredLayout(720);
  return (
    <div
      style={{ "--settings-card-width": `${width - 32}px` } as CSSProperties}
      className="p-4 gap-4 flex-col flex [&>div]:w-[var(--settings-card-width)] w-full items-center"
    >
      {initialized && (
        <>
          <UpdateToggle/>
          <WorkspaceSettings />
          <ThemeSettings />
          <FontSettings />
          {window.isElectron && <ExperimentalFeatures />}
          <AboutCard />
        </>
      )}
    </div>
  );
}
