import { cn } from "@/lib/utils";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { ReactNodeViewRenderer } from "@tiptap/react";
import lowlight from "../../lowlight";
import CodeBlockNodeView from "./code-block-wrapper";
import { Block } from "../../types";
import { getOperatingSystem } from "@/lib/platform";
import { OS } from "@darkwrite/common";
import { ResolvedPos } from "@tiptap/pm/model";


/** Determines the position to delete from in response to the Mod+Backspace key combo, with respect to operating system semantics. */
function getBackwardDeletionStart($head: ResolvedPos) {
  const parentOffset = $head.parentOffset;
  const text = $head.parent.textContent;
  const textBeforeCursor = text.slice(0, parentOffset);

  if (getOperatingSystem() === OS.MACOS) {
    const lastNewline = textBeforeCursor.lastIndexOf("\n");
    return $head.start() + lastNewline + 1;
  } else {
    const match = textBeforeCursor.match(/(?:\s+|\S+)$/);
    return match ? $head.pos - match[0].length : $head.start();
  }
}

/** Determines the position to delete to in response to the Mod+Delete (or Mod+fn+backspace on macOS) key combo, with respect to operating system semantics. */
function getForwardDeletionEnd($head: ResolvedPos) {
  const parentOffset = $head.parentOffset;
  const contentSize = $head.parent.content.size;
  const text = $head.parent.textContent;
  const textAfterCursor = text.slice(parentOffset);
  if (getOperatingSystem() === OS.MACOS) {
    const nextNewline = textAfterCursor.indexOf("\n");
    return nextNewline === -1
      ? $head.start() + contentSize
      : $head.pos + nextNewline;
  } else {
    const match = textAfterCursor.match(/^(?:\s+|\S+)/);
    return match ? $head.pos + match[0].length : $head.start() + contentSize;
  }
}

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
        "Mod-Backspace": () => {
          if (!this.editor.isActive(Block.CodeBlock)) return false;
          const { state, view } = this.editor;
          const { $head } = state.selection;
          const parentOffset = $head.parentOffset;
          if (parentOffset === 0) return true;
          const deleteFrom = getBackwardDeletionStart($head);
          if (deleteFrom < $head.pos) {
            view.dispatch(state.tr.delete(deleteFrom, $head.pos));
          }
          return true;
        },
        "Mod-Delete": () => {
          if (!this.editor.isActive(Block.CodeBlock)) return false;
          const { state, view } = this.editor;
          const { $head } = state.selection;
          const parentOffset = $head.parentOffset;
          const contentSize = $head.parent.content.size;
          if (parentOffset === contentSize) return true;
          const deleteTo = getForwardDeletionEnd($head);
          if ($head.pos < deleteTo) {
            view.dispatch(state.tr.delete($head.pos, deleteTo));
          }
          return true;
        },
        "Mod-ArrowDown": () => this.editor.commands.exitCode(),
      };
    },
    addNodeView: () =>
      ReactNodeViewRenderer(CodeBlockNodeView, {
        contentDOMElementTag: "code",
      }),
  }).configure({
    HTMLAttributes: {
      class: cn("border-none darkwrite-mono font-medium"),
    },
    exitOnTripleEnter: false,
    lowlight,
  });
