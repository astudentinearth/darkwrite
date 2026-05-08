import { cn } from "@/lib/utils";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Highlight from "@tiptap/extension-highlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { Link } from "@tiptap/extension-link";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import { CharacterCount } from "@tiptap/extensions";
import { StarterKit } from "@tiptap/starter-kit";
import AutoJoiner from "tiptap-extension-auto-joiner";
import lowlight from "../lowlight";
import { Block } from "../types";
import { KeymapFixer } from "./keymap-patcher";
import { LinkToPage } from "./link-to-page";
import TableExtensions from "./table/table-extension";
import { ReactMarkViewRenderer } from "@tiptap/react";
import { LinkView } from "../components/link-view";
import { FileLinkExtension } from "../file-link/file-link-extension";

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
  link: false,
  underline: false,
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

export const horizontalRule = HorizontalRule.configure({
  HTMLAttributes: {
    class: cn("mt-4 mb-6 border-t border-muted-foreground"),
  },
});

const link = Link.extend({
  inclusive: false,
  addMarkView() {
    return ReactMarkViewRenderer(LinkView);
  },
}).configure({
  HTMLAttributes: {
    class: cn(
      "text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer",
    ),
  },
  protocols: ["http", "https", "mailto", "tel", "darkwrite"],
});

const underline = Underline.configure();

export const codeBlock = (indentSize: number) =>
  CodeBlockLowlight.extend({
    addKeyboardShortcuts() {
      return {
        Tab: () => {
          if (this.editor.isActive(Block.CodeBlock)) {
            return this.editor.commands.insertContent(
              new Array<string>(indentSize).fill(" ").join(""),
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
    lowlight,
  });

const textStyle = TextStyleKit.configure({ color: { types: ["textStyle"] } });
const hightlight = Highlight.configure({ multicolor: true });
const characterCount = CharacterCount.configure({});
const fileLink = FileLinkExtension.configure();

export const DefaultEditorExtensions = [
  starterKit,
  taskItem,
  taskList,
  AutoJoiner,
  horizontalRule,
  link,
  LinkToPage,
  underline,
  KeymapFixer,
  textStyle,
  hightlight,
  characterCount,
  fileLink,
  ...TableExtensions,
];
