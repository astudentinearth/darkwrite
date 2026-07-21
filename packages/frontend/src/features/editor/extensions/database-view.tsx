import { DatabaseViewType } from "@darkwrite/common";
import { mergeAttributes, Node } from "@tiptap/core";
import type { Node as PMNode, ResolvedPos } from "@tiptap/pm/model";
import { type EditorState, TextSelection } from "@tiptap/pm/state";
import {
  NodeViewWrapper,
  type ReactNodeViewProps,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import { t } from "i18next";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui";
import { DatabasePicker } from "@/features/database/components/database-picker";
import { DatabaseViewRenderer } from "@/features/database/components/database-view";
import { useNoteActions } from "@/features/note/store/note-actions";
import notify from "@/features/notifications/notify";
import { Block } from "../types";

const DELETE_HINT_COOLDOWN_MS = 3000;
let lastDeleteHintAt = 0;

/** Tells the user how to actually delete the node. Throttled so holding
 * or mashing Backspace doesn't stack toasts. */
function showDeleteHint() {
  const now = Date.now();
  if (now - lastDeleteHintAt < DELETE_HINT_COOLDOWN_MS) return;
  lastDeleteHintAt = now;
  notify.info(t("editor.blocks.databaseView.deleteHint"));
}

/** Mirror of prosemirror-commands' internal findCutBefore: the block
 * boundary Backspace deletes across when the cursor is at the start of
 * a textblock. */
function findCutBefore($pos: ResolvedPos): ResolvedPos | null {
  if ($pos.parent.type.spec.isolating) return null;
  for (let i = $pos.depth - 1; i >= 0; i--) {
    if ($pos.index(i) > 0) return $pos.doc.resolve($pos.before(i + 1));
    if ($pos.node(i).type.spec.isolating) break;
  }
  return null;
}

/** Mirror of prosemirror-commands' internal findCutAfter, for Delete. */
function findCutAfter($pos: ResolvedPos): ResolvedPos | null {
  if ($pos.parent.type.spec.isolating) return null;
  for (let i = $pos.depth - 1; i >= 0; i--) {
    if ($pos.index(i) + 1 < $pos.node(i).childCount)
      return $pos.doc.resolve($pos.after(i + 1));
    if ($pos.node(i).type.spec.isolating) break;
  }
  return null;
}

/** @returns the block node that Backspace (dir -1) or Delete (dir 1)
 * would remove across a block boundary, or null when the cursor is not
 * sitting at one. */
function cursorAdjacentBlock(state: EditorState, dir: -1 | 1): PMNode | null {
  const selection = state.selection;
  if (!(selection instanceof TextSelection) || !selection.$cursor) {
    return null;
  }
  const $cursor = selection.$cursor;
  if (dir === -1) {
    if ($cursor.parentOffset > 0) return null;
    return findCutBefore($cursor)?.nodeBefore ?? null;
  }
  if ($cursor.parentOffset < $cursor.parent.content.size) return null;
  return findCutAfter($cursor)?.nodeAfter ?? null;
}

const EmptyState = ({
  addTableView,
  isEditable,
  deleteNode,
  disabled,
}: {
  addTableView: (databaseId: string) => void;
  isEditable: boolean;
  deleteNode: () => void;
  disabled: boolean;
}) => {
  const { t } = useTranslation();
  return (
    <NodeViewWrapper>
      <div
        data-drag-handle=""
        className="not-prose border border-dashed bg-view-2/50 rounded-xl p-2 my-2 flex items-center gap-2"
      >
        <span className="text-sm text-muted-foreground select-none grow pl-2">
          {t("editor.blocks.databaseView.placeholder")}
        </span>
        {isEditable && (
          <>
            <DatabasePicker
              className="w-fit bg-secondary/50"
              disabled={disabled}
              onValueChange={addTableView}
            />
            <Button
              variant="ghost"
              onClick={deleteNode}
              className="w-fit h-fit p-2"
              aria-label={t("editor.blocks.databaseView.remove")}
              title={t("editor.blocks.databaseView.remove")}
            >
              <Trash2 size={16} />
            </Button>
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
};

const DatabaseViewComponent = ({
  node,
  updateAttributes,
  editor,
  deleteNode,
}: ReactNodeViewProps) => {
  const viewIds: string[] = node.attrs.viewIds;
  const [working, setWorking] = useState(false);
  const actions = useNoteActions();

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

  if (viewIds.length === 0)
    return (
      <EmptyState
        addTableView={addTableView}
        deleteNode={deleteNode}
        disabled={working}
        isEditable={editor.isEditable}
      />
    );

  return (
    <NodeViewWrapper>
      <div className="rounded-md my-2">
        <DatabaseViewRenderer
          views={viewIds}
          onViewCreated={(note) => appendView(note.id)}
          destroyView={editor.isEditable ? deleteNode : undefined}
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
  // Not selectable on purpose: node selections made the whole block
  // turn blue on click, showed the bubble menu and made accidental
  // delete/replace far too easy. Deletion goes through destroyView().
  selectable: false,
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
  addKeyboardShortcuts() {
    // The node is not selectable, so ProseMirror's joinBackward and
    // joinForward would silently delete the atom whenever the cursor
    // sits right next to it. Swallow those keys and point users to the
    // delete button instead.
    const guard = (dir: -1 | 1) => () => {
      const block = cursorAdjacentBlock(this.editor.state, dir);
      if (block?.type.name !== this.name) return false;
      showDeleteHint();
      return true;
    };
    return {
      Backspace: guard(-1),
      Delete: guard(1),
    };
  },
});
