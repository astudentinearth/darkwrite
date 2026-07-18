import type { i18n } from "i18next";
import {
  CheckSquare,
  Code,
  Database,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Image,
  Link,
  List,
  ListOrdered,
  Paperclip,
  SquareMinus,
  Table,
  Table2,
  Text,
  TextQuote,
} from "lucide-react";
import { use, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNoteActions } from "@/features/note/store/note-actions";
import { useCurrentWorkspaceId } from "@/features/workspaces/hooks/use-workspace";
import { EditorContext } from "../../store/editor-context";
import { Block, type SlashCommandItem } from "../../types";
import type { ImageExtensionConfig } from "../image/image-config";
import { createImageNode } from "../image/image-upload-transaction";

export const useSlashCommand = (
  imageUploadConfig: ImageExtensionConfig,
  i18n?: i18n,
) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "editor.slashCommand",
    i18n,
  });
  const actions = useNoteActions();
  const workspaceId = useCurrentWorkspaceId();
  const { noteId } = use(EditorContext);
  const items: SlashCommandItem[] = useMemo(
    () => [
      {
        id: "builtin.text",
        title: t("text"),
        description: t("textDescription"),
        keywords: [t("text"), "p", "paragraph", "text"],
        icon: <Text size={18} />,
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .toggleNode("paragraph", "paragraph")
            .run();
        },
      },
      {
        id: "builtin.todolist",
        title: t("toDoList"),
        description: t("toDoListDescription"),
        keywords: [t("toDoList"), "todo", "task", "list", "check"],
        icon: <CheckSquare size={18} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleTaskList().run();
        },
      },
      {
        id: "builtin.h1",
        title: t("heading1"),
        description: t("heading1Description"),
        keywords: [
          t("heading1"),
          "h1",
          "heading",
          "heading1",
          "big",
          "title",
          "large",
        ],
        icon: <Heading1 size={18} />,
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("heading", { level: 1 })
            .run();
        },
      },
      {
        id: "builtin.h2",
        title: t("heading2"),
        description: t("heading2Description"),
        keywords: [
          t("heading2"),
          "h2",
          "heading",
          "heading2",
          "medium",
          "subtitle",
        ],
        icon: <Heading2 size={18} />,
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("heading", { level: 2 })
            .run();
        },
      },
      {
        id: "builtin.h3",
        title: t("heading3"),
        description: t("heading3Description"),
        keywords: [
          t("heading3"),
          "h3",
          "heading",
          "heading3",
          "small",
          "subtitle",
          "subsubtitle",
        ],
        icon: <Heading3 size={18} />,
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("heading", { level: 3 })
            .run();
        },
      },
      {
        id: "builtin.h4",
        title: t("heading4"),
        description: t("heading4Description"),
        keywords: [t("heading4"), "h4", "heading", "heading4"],
        icon: <Heading4 size={18} />,
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("heading", { level: 4 })
            .run();
        },
      },
      {
        id: "builtin.unorderedlist",
        title: t("bulletList"),
        description: t("bulletListDescription"),
        keywords: [t("bulletList"), "ul", "bullet", "list", "unordered"],
        icon: <List size={18} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
      },
      {
        id: "builtin.numberedlist",
        title: t("numberedList"),
        description: t("numberedListDescription"),
        keywords: [t("numberedList"), "ol", "number", "numbered", "list", "no"],
        icon: <ListOrdered size={18} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
      },
      {
        id: "builtin.blockquote",
        title: t("quote"),
        description: t("quoteDescription"),
        keywords: [t("quote"), "quote", "blockquote"],
        icon: <TextQuote size={18} />,
        command: ({ editor, range }) =>
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .toggleNode("paragraph", "paragraph")
            .toggleBlockquote()
            .run(),
      },
      {
        id: "builtin.codeblock",
        title: t("code"),
        description: t("codeDescription"),
        keywords: [t("code"), "code", "codeblock", "block", "snippet"],
        icon: <Code size={18} />,
        command: ({ editor, range }) =>
          editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
      },
      {
        id: "builtin.hr",
        title: t("divider"),
        description: t("dividerDescription"),
        keywords: [t("divider"), "hr", "divider", "horizontal rule"],
        icon: <SquareMinus size={18} />,
        command({ editor, range }) {
          editor.chain().focus().deleteRange(range).setHorizontalRule().run();
        },
      },
      {
        id: "builtin.linktopage",
        title: t("linkToPage"),
        description: t("linkToPageDescription"),
        keywords: [
          t("linkToPage"),
          "link",
          "page",
          "linktopage",
          "shortcut",
          "bookmark",
        ],
        icon: <Link size={18} />,
        command({ editor, range }) {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent({ type: Block.LinkToPage, attrs: { id: "" } })
            .run();
        },
      },
      {
        id: "builtin.image",
        title: t("image"),
        description: t("imageDescription"),
        keywords: [t("image"), "image", "img", "picture", "photo"],
        icon: <Image size={18} />,
        command({ editor, range }) {
          editor.chain().focus().deleteRange(range).run();
          const inp = document.createElement("input");
          inp.type = "file";
          inp.accept = "image/*";
          inp.onchange = () => {
            if (!inp.files?.length) return;
            const file = inp.files[0];
            const pos = editor.view.state.selection.from;
            createImageNode(file, editor.view, pos, imageUploadConfig);
          };
          inp.click();
        },
      },
      {
        id: "builtin.table",
        title: t("table"),
        description: t("tableDescription"),
        keywords: [t("table"), "table", "grid", "rows", "columns"],
        icon: <Table size={18} />,
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertTable({ rows: 3, cols: 3, withHeaderRow: false })
            .run();
        },
      },
      {
        id: "builtin.database",
        title: t("database"),
        description: t("databaseDescription"),
        keywords: [t("database"), "database", "db", "data", "grid"],
        icon: <Database size={18} />,
        command({ editor, range }) {
          editor.chain().focus().deleteRange(range).run();
          actions
            .createDatabase({ parentId: noteId, workspaceId })
            .then(({ data, error }) => {
              if (!data) {
                console.error("Failed to create database:", error);
                return;
              }
              editor
                .chain()
                .focus()
                .insertContent({
                  type: Block.DatabaseView,
                  attrs: { viewIds: data.viewMetadata.map((v) => v.id) },
                })
                .run();
            });
        },
      },
      {
        id: "builtin.tableview",
        title: t("databaseView.table.title"),
        description: t("databaseView.table.description"),
        keywords: [
          t("databaseView.table.title"),
          "table",
          "view",
          "database",
          "db",
        ],
        icon: <Table2 size={18} />,
        command({ editor, range }) {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent({
              type: Block.DatabaseView,
              attrs: { viewIds: [] },
            })
            .run();
        },
      },
      {
        id: "builtin.filelink",
        title: t("fileLink"),
        description: t("fileLinkDescription"),
        keywords: [t("fileLink"), "file", "link", "local", "attachment"],
        icon: <Paperclip size={18} />,
        command({ editor, range }) {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent({
              type: Block.LinkToLocalFile,
              attrs: { linkId: null },
            })
            .run();
        },
      },
    ],
    [imageUploadConfig, t, actions, workspaceId, noteId],
  );
  return { items };
};
