import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  Button,
} from "@/components/ui";
//FIXME: This will be moved to @/components/ui
//import { getNoteIcon } from "@renderer/lib/utils";
import { mergeAttributes, Node } from "@tiptap/core";
import {
  NodeViewWrapper,
  type ReactNodeViewProps,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import { ArrowLeftRight, File } from "lucide-react";
import { Plugin } from "@tiptap/pm/state";
import { memo, type MouseEvent, use, useState } from "react";
import { useTranslation } from "react-i18next";
import { DarkwriteEditorContext } from "../context";
import { cn, getNoteIcon } from "@/lib/utils";
import { useNoteById } from "@/features/note/hooks/use-note-by-id";
import { useSearch } from "@/features/note/hooks/use-search";
import {
  DRAG_DATA_TYPE,
  extractNoteIdFromDragData,
} from "@/features/dnd/datatransfer";
import { Block } from "../types";
import { DarkwriteResource, resourceRefToUrl } from "@darkwrite/common";

const LinkResult = memo(function ({
  id,
  onSelect,
}: {
  id: string;
  onSelect: () => void;
}) {
  const { note } = useNoteById(id);
  if (!note) return null;
  return (
    <CommandItem
      value={`${note.id}$${note.title}`}
      className="flex gap-2"
      onSelect={onSelect}
    >
      <span className="flex">{getNoteIcon(note.icon)}</span>
      <span className="flex">{note.title}</span>
    </CommandItem>
  );
});

// TODO: make this type safe
const LinkComponent = ({
  node,
  updateAttributes,
  selected,
  editor,
  getPos,
}: ReactNodeViewProps) => {
  const id = node.attrs.noteID;
  const context = use(DarkwriteEditorContext);
  const { note } = useNoteById(id);
  const navToNote = context.onNavigateToNote;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { results, debouncedSearch } = useSearch(search);

  const contextMenu = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setOpen(true);
  };

  const turnIntoInlineLink = () => {
    if (!note) return;
    const icon = getNoteIcon(note.icon);
    const linkContent = `${typeof icon === "string" ? `${icon} ` : ""}${note.title}`;
    const pos = getPos();
    const url = resourceRefToUrl({ type: DarkwriteResource.Note, id: note.id });
    if (typeof pos !== "number") return;
    editor
      .chain()
      .focus()
      .deleteRange({ from: pos, to: pos + node.nodeSize })
      .insertContentAt(pos, {
        type: "text",
        text: linkContent,
        marks: [{ type: "link", attrs: { href: url } }],
      })
      .run();
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
            className={cn(
              "link-to-page hover:bg-secondary/75 cursor-pointer select-none rounded-md p-1 py-0.5 transition-colors flex items-center gap-2 my-1 text-(--dw-editor-foreground)",
              (open || selected) && "bg-primary/20",
            )}
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
          className="p-0 max-h-[30vh] overflow-clip border-border rounded-lg top-highlight bg-view-2/80 backdrop-blur-lg"
        >
          {note && (
            <>
              <div className="p-1 w-full flex">
                <Button
                  variant="ghost"
                  onClick={turnIntoInlineLink}
                  className="h-fit px-2 py-1.5 w-full justify-start"
                >
                  <ArrowLeftRight size={16} />
                  <span>
                    {t("editor.blocks.linkToPage.turnIntoInlineLink")}
                  </span>
                </Button>
              </div>
              <hr />
            </>
          )}
          <Command className="h-full max-h-[30vh]">
            <CommandInput
              value={search}
              onValueChange={(val) => {
                setSearch(val);
                debouncedSearch(search);
              }}
              placeholder={t("search.chooserPlaceholder")}
            />
            <CommandList className="p-1 scroll-view">
              <CommandEmpty>{t("search.noResult")}</CommandEmpty>
              {results.map((n) => (
                <LinkResult
                  onSelect={() => {
                    updateAttributes({ noteID: n });
                    setOpen(false);
                  }}
                  key={n}
                  id={n}
                />
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </NodeViewWrapper>
  );
};

export const LinkToPage = Node.create({
  name: Block.LinkToPage,
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
      mergeAttributes(HTMLAttributes, { "data-type": Block.LinkToPage }),
    ];
  },
  parseHTML() {
    return [
      {
        tag: `div[data-type="${Block.LinkToPage}"]`,
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
              event.dataTransfer.types.includes(DRAG_DATA_TYPE)
            ) {
              const id = extractNoteIdFromDragData(event);
              if (!id) return false;
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
