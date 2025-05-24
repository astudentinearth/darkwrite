import { Editor, Extension, Range } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion"


export const SlashCommandExtension = Extension.create({
  name: "slash-command",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        // i dont know the correct type, but it works
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        command: ({ editor, range, props }: {editor: Editor, range: Range, props: any}) => {
          props.command({editor, range})
        }
      }
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion
      })
    ]
  },
})

export default SlashCommandExtension;