import {
  EditorContent,
  EditorRoot,
  type JSONContent
} from "novel";
import { ImageResizer, handleCommandNavigation } from "novel/extensions";
import Bubble from "./bubble-menu";
import SlashCommand from "./command-menu";
import { slashCommand } from "./command-menu/slash-command";
import { defaultExtensions } from "./extensions/extensions";
import { cn } from "@renderer/lib/utils";

const extensions = [...defaultExtensions, slashCommand];

interface EditorProp {
  initialValue?: JSONContent;
  onChange: (value: JSONContent) => void;
}
export const TextEditor = ({ initialValue, onChange }: EditorProp) => {
  return (
    <EditorRoot>
      <EditorContent
        className="p-0 rounded-xl w-full dark transition-transform"
        {...(initialValue && { initialContent: initialValue })}
        extensions={extensions}
        editorProps={{
          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event),
          },
          attributes: {
            class: cn(`prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`),
          },
          handleDrop: (_view, event)=> {
            if(event.dataTransfer?.types.includes("note_id")) console.log("Linking to note")
            
          }
        }}
        onUpdate={({ editor }) => {onChange(editor.getJSON())}}
        slotAfter={<ImageResizer />}>
        <SlashCommand/>
        <Bubble/>
      </EditorContent>
    </EditorRoot>
  );
};
