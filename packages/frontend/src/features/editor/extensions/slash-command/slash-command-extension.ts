import { type Editor, Extension, type Range } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion";
import { SlashCommandRenderer } from "./slash-command-renderer";

export const SlashCommandExtension = Extension.create({
  name: "slash-command",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        pluginKey: new PluginKey("slashcommand"),
        allow: () => {
          return true;
        },
        render: SlashCommandRenderer.render,
        // i dont know the correct type, but it works
        command: ({
          props,
        }: {
          editor: Editor;
          range: Range;
          // biome-ignore lint/suspicious/noExplicitAny: tiptap
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
