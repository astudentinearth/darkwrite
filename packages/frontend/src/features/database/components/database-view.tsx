import React from "react";
import { useViewsById } from "../hooks/use-views-by-id";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { useNoteById } from "@/features/note/hooks/use-note-by-id";
import { DatabaseViewMeta } from "@darkwrite/common";
import { ViewIcon } from "./view-icon";

export type DatabaseViewProps = React.ComponentProps<"div"> & {
  views: string[];
};

function ViewTabTrigger(props: { view: DatabaseViewMeta }) {
  const { note } = useNoteById(props.view.id);
  if (!note) return null;

  return (
    <TabsTrigger
      value={props.view.id}
      className="bg-transparent hover:bg-secondary/75! data-[state=active]:bg-secondary/50 flex items-center gap-2 px-2 rounded-md"
    >
      <ViewIcon type={props.view.type} size={18} />
      {note.title}
    </TabsTrigger>
  );
}

export function DatabaseViewRenderer(props: DatabaseViewProps) {
  const { views } = useViewsById(props.views);

  return (
    <Tabs className="w-full">
      <TabsList className="bg-transparent px-0 border-b w-full justify-start rounded-none">
        {views.map((view) => (
          <ViewTabTrigger view={view} />
        ))}
      </TabsList>
    </Tabs>
  );
}
