import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui";
//FIXME: This will be moved to @/components/ui
//import { getNoteIcon } from "@renderer/lib/utils";
import { mergeAttributes, Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { File } from "lucide-react";
import { Plugin } from "prosemirror-state";
import { MouseEvent, use, useState } from "react";
import { useTranslation } from "react-i18next";
import { DarkwriteEditorContext } from "../context";
import { getNoteIcon } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LinkComponent = ({ node, updateAttributes }: any) => {
  const id = node.attrs.noteID;
  const context = use(DarkwriteEditorContext);
  const notes = context.notes?.filter((n) => !n.isTrashed);
  const note = notes?.find((n) => n.id === id);
  const navToNote = context.onNavigateToNote;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const contextMenu = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setOpen(true);
  };
  return (
    <NodeViewWrapper className="linkToPage">
      <Popover modal open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            onContextMenu={contextMenu}
            data-drag-handle=""
            onClick={(e) => {
              e.preventDefault();
              if (note) navToNote?.call(undefined, id);
              else setOpen(true);
            }}
            className="link-to-page hover:bg-secondary/75 cursor-pointer select-none rounded-md p-1 py-0.5 transition-colors flex items-center gap-2 my-1 text-(--dw-editor-foreground)"
          >
            {!note ? (
              <File size={18} className="opacity-75" />
            ) : (
              getNoteIcon(note.icon)
            )}
            {!note ? (
              t("editor.blocks.linkToPage.placeholder")
            ) : (
              <span className="font-semibold">{note?.title}</span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          sticky="always"
          align={"center"}
          className="p-0 max-h-[30vh] overflow-clip border-border"
        >
          <Command className="h-full max-h-[30vh]">
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder={t("search.chooserPlaceholder")}
            />
            <CommandList className="scrollbar p-1 ">
              <CommandEmpty>{t("search.noResult")}</CommandEmpty>
              {notes
                ?.filter((n) =>
                  n.title
                    .toLocaleLowerCase()
                    .includes(search.toLocaleLowerCase()),
                )
                .map((n) => (
                  <CommandItem
                    onSelect={() => {
                      updateAttributes({ noteID: n.id });
                      setOpen(false);
                    }}
                    key={n.id}
                    value={`${n.id}$${n.title}`}
                    className="flex gap-2"
                  >
                    {getNoteIcon(n.icon)}
                    {n.title}
                  </CommandItem>
                ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </NodeViewWrapper>
  );
};

export const LinkToPage = Node.create({
  name: "linkToPage",
  priority: 101,
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      noteID: {
        default: null,
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(LinkComponent);
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "linkToPage" }),
    ];
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-type="linkToPage"]',
      },
    ];
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDrop(view, event) {
            if (
              event.dataTransfer &&
              event.dataTransfer.types.includes("note_id")
            ) {
              const id = event.dataTransfer.getData("note_id");
              const nodeType = view.state.schema.nodes.linkToPage;
              const pos = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              });
              if (!pos) return false;
              view.dispatch(
                view.state.tr.insert(pos?.pos, nodeType.create({ noteID: id })),
              );
              return true;
            }
            return false;
          },
        },
      }),
    ];
  },
});
