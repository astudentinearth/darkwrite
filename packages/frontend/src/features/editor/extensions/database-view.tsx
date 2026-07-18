import { DatabaseViewType } from "@darkwrite/common";
import { mergeAttributes, Node } from "@tiptap/core";
import {
  NodeViewWrapper,
  type ReactNodeViewProps,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DatabasePicker } from "@/features/database/components/database-picker";
import { DatabaseViewRenderer } from "@/features/database/components/database-view";
import { useNoteActions } from "@/features/note/store/note-actions";
import { cn } from "@/lib/utils";
import { Block } from "../types";

const DatabaseViewComponent = ({
  node,
  updateAttributes,
  selected,
  editor,
}: ReactNodeViewProps) => {
  const viewIds: string[] = node.attrs.viewIds;
  const [working, setWorking] = useState(false);
  const actions = useNoteActions();
  const { t } = useTranslation();

  const appendView = (viewId: string) => {
    updateAttributes({ viewIds: [...viewIds, viewId] });
  };

  const addTableView = (databaseId: string) => {
    setWorking(true);
    actions
      .createDatabaseView({ databaseId, type: DatabaseViewType.Table })
      .then(({ data, error }) => {
        if (data) appendView(data.note.id);
        else console.error("Failed to create database view:", error);
      })
      .finally(() => setWorking(false));
  };

  if (viewIds.length === 0) {
    return (
      <NodeViewWrapper>
        <div
          data-drag-handle=""
          className={cn(
            "not-prose border rounded-md p-3 my-2 flex flex-col gap-2",
            selected && "bg-primary/10",
          )}
        >
          <span className="text-sm text-muted-foreground select-none">
            {t("editor.blocks.databaseView.placeholder")}
          </span>
          {editor.isEditable && (
            <DatabasePicker disabled={working} onValueChange={addTableView} />
          )}
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper>
      <div className={cn("rounded-md my-2", selected && "bg-primary/10")}>
        <DatabaseViewRenderer
          views={viewIds}
          onViewCreated={(note) => appendView(note.id)}
        />
      </div>
    </NodeViewWrapper>
  );
};

/** Block node that embeds database views into a document. Holds the ids of
 * the embedded views in its `viewIds` attribute; views from any database can
 * be mixed freely. */
export const DatabaseViewNode = Node.create({
  name: Block.DatabaseView,
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      viewIds: {
        default: [],
        parseHTML: (el) => JSON.parse(el.getAttribute("data-view-ids") ?? "[]"),
        renderHTML: (attrs) => ({
          "data-view-ids": JSON.stringify(attrs.viewIds ?? []),
        }),
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(DatabaseViewComponent);
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": Block.DatabaseView }),
    ];
  },
  parseHTML() {
    return [
      {
        tag: `div[data-type="${Block.DatabaseView}"]`,
      },
    ];
  },
});
