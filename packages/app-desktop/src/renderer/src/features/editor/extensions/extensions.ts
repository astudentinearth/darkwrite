import {
  TiptapLink,
  UpdatedImage,
  TaskList,
  TaskItem,
  HorizontalRule,
  StarterKit,
  Placeholder,
  AIHighlight,
  GlobalDragHandle,
  TiptapUnderline,
  TextStyle,
  Color,
  HighlightExtension,
} from "novel/extensions";
import { cx } from "class-variance-authority";
import AutoJoiner from "tiptap-extension-auto-joiner";
import { cn } from "@renderer/lib/utils";
import { LinkToPage } from "./link-to-page";

const aiHighlight = AIHighlight;
const placeholder = Placeholder.configure({});
const tiptapLink = TiptapLink.configure({
  HTMLAttributes: {
    class: cx(
      "text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer",
    ),
  },
});

const updatedImage = UpdatedImage.configure({
  HTMLAttributes: {
    class: cx("rounded-lg border border-muted"),
  },
});

const taskList = TaskList.configure({
  HTMLAttributes: {
    class: cx("not-prose pl-2 "),
  },
});
const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: cx("flex gap-2 items-start my-4"),
  },
  nested: true,
});

const horizontalRule = HorizontalRule.configure({
  HTMLAttributes: {
    class: cx("mt-4 mb-6 border-t border-muted-foreground"),
  },
});

const starterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      class: cx("list-disc list-outside leading-3 -mt-2"),
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: cx("list-decimal list-outside leading-3 -mt-2"),
    },
  },
  listItem: {
    HTMLAttributes: {
      class: cx("leading-normal -mb-2"),
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: cx(
        "border-l-4 border-secondary/50 not-italic [&>p]:before:content-none [&>p]:after:content-none [&>p]:text-muted-foreground/75",
      ),
    },
  },
  codeBlock: {
    HTMLAttributes: {
      class: cn(
        "rounded-xl bg-secondary/50 text-muted-foreground border-none p-4 font-mono font-medium",
      ),
    },
  },
  code: {
    HTMLAttributes: {
      class: cx(
        "rounded-md bg-muted  px-1.5 py-1 font-mono font-medium before:content-none after:content-none",
      ),
      spellcheck: "false",
    },
  },
  horizontalRule: false,
  dropcursor: {
    color: "#DBEAFE",
    width: 4,
  },
  gapcursor: false,
});

const underline = TiptapUnderline.configure();

export const defaultExtensions = [
  starterKit,
  placeholder,
  tiptapLink,
  updatedImage,
  taskList,
  taskItem,
  horizontalRule,
  aiHighlight,
  GlobalDragHandle,
  AutoJoiner,
  underline,
  TextStyle,
  Color,
  HighlightExtension,
  LinkToPage,
];
