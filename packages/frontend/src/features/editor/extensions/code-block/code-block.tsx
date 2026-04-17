import { cn } from "@/lib/utils";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { ReactNodeViewRenderer } from "@tiptap/react";
import lowlight from "../../lowlight";
import CodeBlockNodeView from "./code-block-wrapper";
import { Block } from "../../types";

export const CodeBlockExtension = (indentSizeCallback: () => number) =>
  CodeBlockLowlight.extend({
    addKeyboardShortcuts() {
      return {
        Tab: () => {
          if (this.editor.isActive(Block.CodeBlock)) {
            return this.editor.commands.insertContent(
              new Array<string>(indentSizeCallback()).fill(" ").join(""),
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
    addNodeView: () =>
      ReactNodeViewRenderer(CodeBlockNodeView, {
        //contentDOMElementTag: "code",
      }),
  }).configure({
    HTMLAttributes: {
      class: cn("border-none darkwrite-mono font-medium"),
    },
    exitOnTripleEnter: false,
    lowlight,
  });
