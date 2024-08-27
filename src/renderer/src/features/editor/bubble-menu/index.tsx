import { EditorBubble } from "novel";
import { FormattingButtons } from "./formatting";

export default function Bubble(){
    return <EditorBubble
          tippyOptions={{
            placement: "top",
            animation: "slide"}}
          className="flex w-fit max-w-[90vw] overflow-hidden rounded-xl border border-muted bg-background shadow-xl slide-in-from-top-1 transition-opacity">
          <FormattingButtons/>
        </EditorBubble>
}