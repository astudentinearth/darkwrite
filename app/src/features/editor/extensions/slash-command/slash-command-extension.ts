import { Editor, Extension, Range } from "@tiptap/core";
import Suggestion, { SuggestionOptions } from "@tiptap/suggestion";
import { SlashCommandRenderer } from "./slash-command-renderer";

export const SlashCommandExtension = Extension.create({
  name: "slash-command",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        allow: () => {
          console.trace("ALLOW");
          return true;
        },
        render: SlashCommandRenderer.render,
        // i dont know the correct type, but it works
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          props: any;
        }) => {
          props.command(props.props);
        },
      } satisfies Omit<SuggestionOptions, "editor">,
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

export default SlashCommandExtension;
