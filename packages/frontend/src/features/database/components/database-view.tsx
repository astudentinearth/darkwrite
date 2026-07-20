import {
  type DatabaseViewMeta,
  DatabaseViewType,
  type NoteDTO,
} from "@darkwrite/common";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import type React from "react";
import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { useNoteById } from "@/features/note/hooks/use-note-by-id";
import { useNoteActions } from "@/features/note/store/note-actions";
import { useCurrentWorkspaceId } from "@/features/workspaces/hooks/use-workspace";
import { useViewsById } from "../hooks/use-views-by-id";
import { DatabaseViewContext } from "../store/database-view-context";
import { NewDatabaseViewPopover } from "./new-view-popover";
import { TableView } from "./table-view";
import { ViewIcon } from "./view-icon";

export enum RenderingMode {
  /** This view is rendered inside a document, as an embed. */
  Inline = "inline",

  /** This view is rendered as part of a database page, not as an embed. */
  FullPage = "fullPage",
}

export type DatabaseViewProps = React.ComponentProps<"div"> & {
  views: string[];
  onViewCreated?: (note: NoteDTO) => void;
  /** Destroys the surrounding embed (e.g. deletes the editor node
   * hosting this renderer). A delete button is only rendered when this
   * callback is explicitly provided. */
  destroyView?: () => void;
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
  const [activeViewId, setActiveViewId] = useState(views.at(0)?.id);
  const effectiveId = activeViewId ?? views.at(0)?.id;
  const { note: activeView } = useNoteById(effectiveId);
  const { createNote } = useNoteActions();
  const workspaceId = useCurrentWorkspaceId();
  const { t } = useTranslation();

  return (
    !isLoading && (
      <Tabs
        className="dw-database-view not-prose w-full"
        defaultValue={views.at(0)?.id}
        value={effectiveId}
        onValueChange={setActiveViewId}
      >
        <TabsList className="bg-transparent px-0 border-b w-full justify-start rounded-none grid grid-cols-[1fr_auto] gap-0.5">
          <div className="w-full overflow-x-auto flex gap-0.5">
            {views.map((view) => (
              <ViewTabTrigger key={view.id} view={view} />
            ))}
            <NewDatabaseViewPopover
              onCreate={(note) => {
                setActiveViewId(note.id);
                props.onViewCreated?.(note);
              }}
              defaultDatabaseId={activeView?.parentId ?? undefined}
            />
          </div>
          <div className="flex items-center gap-1">
            {activeView && (
              <Button
                onClick={() =>
                  createNote({
                    workspaceId,
                    parentId: activeView.parentId,
                  })
                }
                className="w-fit h-fit px-1.5 py-1 gap-1"
              >
                <IconPlus size={18} />
                {t("sidebar.button.newPage")}
              </Button>
            )}
            {props.destroyView && (
              <Button
                variant="secondary"
                onClick={props.destroyView}
                className="w-fit h-fit px-1.5 py-1"
                aria-label={t("editor.blocks.databaseView.remove")}
                title={t("editor.blocks.databaseView.remove")}
              >
                <IconTrash size={18} />
              </Button>
            )}
          </div>
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
