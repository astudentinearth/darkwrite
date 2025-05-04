import { Editor, Extension, Range } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion"


export default Extension.create({
  name: "slash-command",

  addOptions() {
    return {
      suggestion: {
        char: "/",
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
