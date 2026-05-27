/** eslint-disable @typescript-eslint/no-explicit-any */

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type SETTINGS_PAGE,
  SETTINGS_PAGES,
  TAB_ICONS,
  TAB_TITLES,
} from "./settings-pages";

export default function SettingsDialog(props: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="min-w-[80vw] border-border/40 top-highlight lg:min-w-[70vw] max-w-120! h-[80vh] p-2 pt-1 pb-0 bg-background/85 backdrop-blur-2xl outline-none flex flex-col">
        <SettingsTabView />
      </DialogContent>
    </Dialog>
  );
}

export function SettingsTabView() {
  const { t } = useTranslation();
  return (
    <Tabs className="h-full flex flex-col">
      <TabsList className="bg-transparent w-full gap-1">
        {Object.keys(TAB_TITLES).map((key) => {
          const TabIcon = TAB_ICONS[key as SETTINGS_PAGE];
          return (
            <TabsTrigger
              key={key}
              value={key}
              className="flex gap-2 data-[state=active]:bg-secondary/40 data-[state=active]:text-primary-text hover:bg-secondary/80 rounded-lg py-2 px-4"
            >
              <TabIcon size={18} />
              {/** biome-ignore lint/suspicious/noExplicitAny: complex type */}
              {t(TAB_TITLES[key as SETTINGS_PAGE] as any)}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {Object.keys(TAB_TITLES).map((key) => {
        const Page = SETTINGS_PAGES[key as SETTINGS_PAGE];
        return (
          <TabsContent
            key={key}
            value={key}
            className="w-full h-full overflow-y-auto scroll-view pb-8"
          >
            <Page />
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
