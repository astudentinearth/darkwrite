import { cn } from "@/utils";
import { StarterKit } from "@tiptap/starter-kit";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import AutoJoiner from "tiptap-extension-auto-joiner";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import { Placeholder } from "@tiptap/extension-placeholder";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { Link } from "@tiptap/extension-link";
import { LinkToPage } from "./link-to-page";
import {Underline} from "@tiptap/extension-underline"

export const starterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      class: cn("list-disc list-outside leading-3 -mt-2"),
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: cn("list-decimal list-outside leading-3 -mt-2"),
    },
  },
  listItem: {
    HTMLAttributes: {
      class: cn("leading-normal -mb-2"),
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: cn(
        "border-l-4 border-secondary/50 not-italic [&>p]:before:content-none [&>p]:after:content-none [&>p]:text-(--dw-editor-foreground) opacity-80",
      ),
    },
  },
  code: {
    HTMLAttributes: {
      class: cn(
        "rounded-md bg-secondary/50 text-muted-foreground px-1.5 py-1 darkwrite-mono font-medium before:content-none after:content-none",
      ),
      spellcheck: "false",
    },
  },
  horizontalRule: false,
  codeBlock: false,
  dropcursor: {
    color: "#DBEAFE55",
    width: 3,
    class: "rounded-md",
  },
  gapcursor: false,
});

export const taskList = TaskList.configure({
  HTMLAttributes: {
    class: cn("not-prose pl-2 "),
  },
});

export const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: cn("flex gap-2 items-start my-4"),
  },
  nested: true,
});

export const placeholder = Placeholder.configure({});

const horizontalRule = HorizontalRule.configure({
  HTMLAttributes: {
    class: cn("mt-4 mb-6 border-t border-muted-foreground"),
  },
});

const link = Link.configure({
  HTMLAttributes: {
    class: cn(
      "text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer",
    ),
  },
});

const underline = Underline.configure();

export const DefaultEditorExtensions = [
  starterKit,
  taskItem,
  taskList,
  AutoJoiner,
  GlobalDragHandle,
  placeholder,
  horizontalRule,
  link,
  LinkToPage,
  underline
];
