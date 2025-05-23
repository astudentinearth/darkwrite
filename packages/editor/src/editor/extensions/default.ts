import { cn } from "@/utils";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { Link } from "@tiptap/extension-link";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { Underline } from "@tiptap/extension-underline";
import { StarterKit } from "@tiptap/starter-kit";
import AutoJoiner from "tiptap-extension-auto-joiner";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import { LinkToPage } from "./link-to-page";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import lowlight from "../lowlight";
import { KeymapFixer } from "./keymap-patcher";

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

export const placeholder = Placeholder.configure({
  includeChildren: true,
  placeholder: "Press '/' for commands",
  showOnlyCurrent: true
});

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

export const codeBlock = (indentSize: number)=>CodeBlockLowlight.extend({
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        if (this.editor.isActive("codeBlock")) {
          return this.editor.commands.insertContent(
            new Array<string>(
              indentSize,
            )
              .fill(" ")
              .join(""),
          );
        } else return false;
      },
      ArrowDown: () => {
        if (
          this.editor.state.selection.$head.parentOffset ===
          this.editor.state.selection.$head.parent.content.size
        ) {
          return this.editor.commands.exitCode();
        } else return false;
      },
      "Mod-ArrowDown": () => this.editor.commands.exitCode(),
    };
  },
}).configure({
  HTMLAttributes: {
    class: cn(
      "rounded-xl bg-secondary/50 border-none p-4 darkwrite-mono font-medium",
    ),
  },
  exitOnTripleEnter: true,
  lowlight
});

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
  underline,
  KeymapFixer
];
