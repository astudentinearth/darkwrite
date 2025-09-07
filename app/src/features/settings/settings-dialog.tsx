import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode } from "react";
import { SETTINGS_PAGE, TAB_TITLES, TAB_ICONS, SETTINGS_PAGES } from "./settings-pages";

export default function SettingsDialog(props: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent
        className="min-w-[80vw] lg:min-w-[70vw] max-w-120! h-[80vh] p-2 pt-1 bg-background outline-none" 
      >
        <SettingsTabView />
      </DialogContent>
    </Dialog>
  );
}

export function SettingsTabView(props: { className?: string }) {
  return (
    <Tabs>
      <TabsList className="bg-transparent w-full gap-1">
        {Object.keys(TAB_TITLES).map((key) => {
          const TabIcon = TAB_ICONS[key as SETTINGS_PAGE];
          return (
            <TabsTrigger key={key} value={key} className="flex gap-2 data-[state=active]:bg-secondary/40 data-[state=active]:text-primary-text hover:bg-secondary/80 rounded-lg py-2 px-4">
              <TabIcon size={18}/>
              {TAB_TITLES[key as SETTINGS_PAGE]}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {Object.keys(TAB_TITLES).map((key) => {
        const Page = SETTINGS_PAGES[key as SETTINGS_PAGE]
        return (
          <TabsContent key={key} value={key} className="w-full">
            <Page/>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
