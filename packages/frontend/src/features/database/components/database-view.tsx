import { DatabaseViewMeta, DatabaseViewType } from "@darkwrite/common";
import type React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { useNoteById } from "@/features/note/hooks/use-note-by-id";
import { useViewsById } from "../hooks/use-views-by-id";
import { ViewIcon } from "./view-icon";
import { TableView } from "./table-view";
import { JSX } from "react";
import { DatabaseViewContext } from "../store/database-view-context";

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

const viewMap: Record<DatabaseViewType, JSX.Element> = {
  [DatabaseViewType.Table]: <TableView />,
  [DatabaseViewType.Calendar]: <TableView />,
  [DatabaseViewType.Board]: <TableView />,
};

function ViewRenderer(props: { view: DatabaseViewMeta }) {
  const view = useNoteById(props.view.id);

  if (!view.note?.parentId) return null;

  return (
    <DatabaseViewContext.Provider
      value={{
        viewMeta: props.view,
        viewId: props.view.id,
        databaseId: view.note.parentId,
      }}
    >
      {viewMap[props.view.type]}
    </DatabaseViewContext.Provider>
  );
}

export function DatabaseViewRenderer(props: DatabaseViewProps) {
  const { views, isLoading } = useViewsById(props.views);

  return (
    !isLoading && (
      <Tabs className="w-full" defaultValue={views.at(0)?.id}>
        <TabsList className="bg-transparent px-0 border-b w-full justify-start rounded-none">
          {views.map((view) => (
            <ViewTabTrigger key={view.id} view={view} />
          ))}
        </TabsList>
        {views.map((view) => (
          <TabsContent key={view.id} value={view.id}>
            <ViewRenderer view={view} />
          </TabsContent>
        ))}
      </Tabs>
    )
  );
}
