import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { useNoteList } from "../hooks/use-note-list";
import type { NoteTreeItem } from "../store/notes-ui-selectors";
import { NoteItem } from "./note-item";

const rowHeight = (item: NoteTreeItem) => {
  switch (item.type) {
    case "allNotesHeading":
    case "favoriteHeading":
    case "item":
    case "favorite":
    case "createNew":
      return 32;

    case "spacer":
      return 8;
  }
};

const getItemKey = (item: NoteTreeItem) =>
  `${item.id}-${item.type}-${item.depth}`;

export function FlatNoteList() {
  const { items } = useNoteList();
  const container = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    estimateSize: (idx) => rowHeight(items[idx]),
    getScrollElement: () => container.current,
    getItemKey: (idx) => getItemKey(items[idx]),
    overscan: 5,
  });

  return (
    <div
      ref={container}
      className="h-full w-full grow pl-2 pr-0 py-0 overflow-y-auto scroll-view gutter-stable"
    >
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map((v) => (
          <div
            key={v.key}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: v.size,
              transform: `translateY(${v.start}px)`,
            }}
          >
            <NoteItem item={items[v.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
