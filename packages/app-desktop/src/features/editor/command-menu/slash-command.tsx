import {
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Image,
  Link,
  List,
  ListOrdered,
  SquareMinus,
  Text,
  TextQuote
} from "lucide-react";
/** @deprecated - use darkwrite/editor instead. */
import { Command, createSuggestionItems, renderItems } from "novel/extensions";
import { useTranslation } from "react-i18next";
import { createImageNode } from "../extensions/image-upload";

/** @deprecated - use darkwrite/editor instead. */
export const useSlashCommand = ()=>{
  const {t} = useTranslation(undefined, {keyPrefix: "editor.slashCommand"});
  const suggestionItems = createSuggestionItems([
    {
      title: t("text"),
      description: t("textDescription"),
      searchTerms: ["p", "paragraph"],
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
      title: t("toDoList"),
      description: t("toDoListDescription"),
      searchTerms: ["todo", "task", "list", "check", "checkbox"],
      icon: <CheckSquare size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run();
      },
    },
    {
      title: t("heading1"),
      description: t("heading1Description"),
      searchTerms: ["title", "big", "large"],
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
      title: t("heading2"),
      description: t("heading2Description"),
      searchTerms: ["subtitle", "medium"],
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
      title: t("heading3"),
      description: t("heading3Description"),
      searchTerms: ["subtitle", "small"],
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
      title: t("heading4"),
      description: t("heading4Description"),
      searchTerms: ["subtitle", "small"],
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
      title: t("bulletList"),
      description: t("bulletListDescription"),
      searchTerms: ["unordered", "point"],
      icon: <List size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: t("numberedList"),
      description: t("numberedListDescription"),
      searchTerms: ["ordered"],
      icon: <ListOrdered size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      title: t("quote"),
      description: t("quoteDescription"),
      searchTerms: ["blockquote"],
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
      title: t("code"),
      description: t("codeDescription"),
      searchTerms: ["code", "snippet", "block"],
      icon: <Code size={18} />,
      command: ({ editor, range }) =>
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
    },
    {
      title: t("divider"),
      description: t("dividerDescription"),
      searchTerms: ["divider", "hr", "separator", "horizontal rule"],
      icon: <SquareMinus size={18} />,
      command({ editor, range }) {
        editor.chain().focus().deleteRange(range).setHorizontalRule().run();
      },
    },
    {
      title: t("linkToPage"),
      description: t("linkToPageDescription"),
      searchTerms: ["link"],
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
    {
      title: t("image"),
      description: t("imageDescription"),
      searchTerms: ["image", "img", "picture", "photo"],
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
          createImageNode(file, editor.view, pos);
        };
        inp.click();
      },
    },
  ]);
  
  const slashCommandExtension = Command.configure({
    suggestion: {
      items: () => suggestionItems,
      render: renderItems,
    },
    
  });
  
  return {suggestionItems, slashCommand: slashCommandExtension}

}
