import { SlashCommandItem } from "@/types";
import { useTranslation } from "react-i18next";
import { Text, CheckSquare, Heading1, Heading2, Heading3, Link, SquareMinus, Code, TextQuote, ListOrdered, List, Heading4 } from "lucide-react"

export const useSlashCommand = ()=>{
  const {t} = useTranslation(undefined, {keyPrefix: "editor.slashCommand"});
  const items: SlashCommandItem[] = [
    {
      id: "builtin.text",
      title: t("text"),
      description: t("textDescription"),
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
      icon: <CheckSquare size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run();
      },
    },
    {
      id: "builtin.h1",
      title: t("heading1"),
      description: t("heading1Description"),
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
      icon: <List size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      id: "builtin.numberedlist",
      title: t("numberedList"),
      description: t("numberedListDescription"),
      icon: <ListOrdered size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      id: "builtin.blockquote",
      title: t("quote"),
      description: t("quoteDescription"),
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
      icon: <Code size={18} />,
      command: ({ editor, range }) =>
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
    },
    {
      id: "builtin.hr",
      title: t("divider"),
      description: t("dividerDescription"),
      icon: <SquareMinus size={18} />,
      command({ editor, range }) {
        editor.chain().focus().deleteRange(range).setHorizontalRule().run();
      },
    },
    {
      id: "builtin.linktopage",
      title: t("linkToPage"),
      description: t("linkToPageDescription"),
      icon: <Link size={18} />,
      command({ editor, range }) {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent({ type: "linkToPage", attrs: { id: "" } })
          .run();
      },
    },
    // {
    //   id: "builtin.image",
    //   title: t("image"),
    //   description: t("imageDescription"),
    //   searchTerms: ["image", "img", "picture", "photo"],
    //   icon: <Image size={18} />,
    //   command({ editor, range }) {
    //     editor.chain().focus().deleteRange(range).run();
    //     const inp = document.createElement("input");
    //     inp.type = "file";
    //     inp.accept = "image/*";
    //     inp.onchange = () => {
    //       if (!inp.files?.length) return;
    //       const file = inp.files[0];
    //       const pos = editor.view.state.selection.from;
    //       createImageNode(file, editor.view, pos);
    //     };
    //     inp.click();
    //   },
    // },
  ];

  return { items };
}