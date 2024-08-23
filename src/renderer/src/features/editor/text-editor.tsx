import { EditorRoot, EditorContent, EditorCommand, EditorBubble } from "novel"
import { defaultExtensions } from "./extensions"
import { cn } from "@renderer/lib/utils"
import { FormattingButtons } from "./bubble-menu/formatting"

export function TextEditor(){
    return <div className="bg-black max-w-[960px] w-full">
        <EditorRoot>
            <EditorContent editorProps={{
                attributes: {
                    class: cn("bg-black max-w-[960px] w-full")
                }
            }} extensions={defaultExtensions}>
                <EditorBubble className="bg-background border border-border rounded-xl overflow-clip">
                    <FormattingButtons/>
                </EditorBubble>
            </EditorContent>
        </EditorRoot>
    </div>
}