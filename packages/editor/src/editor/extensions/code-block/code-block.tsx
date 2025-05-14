import { cn } from "@/utils";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { ReactNodeViewRenderer } from "@tiptap/react";
import lowlight from "../../lowlight";
import CodeBlockNodeView from "./code-block-wrapper";

export const codeBlock = (indentSize: number) =>
  CodeBlockLowlight.extend({
    addKeyboardShortcuts() {
      return {
        Tab: () => {
          if (this.editor.isActive("codeBlock")) {
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
    addNodeView: () =>  ReactNodeViewRenderer(CodeBlockNodeView),
  }).configure({
    HTMLAttributes: {
      class: cn(
        "border-none darkwrite-mono font-medium",
      ),
    },
    exitOnTripleEnter: true,
    lowlight,
  });
