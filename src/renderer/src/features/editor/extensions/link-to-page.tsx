import { useNotesStore } from "@renderer/context/notes-context";
import { useNavigateToNote } from "@renderer/hooks/use-navigate-to-note";
import { fromUnicode } from "@renderer/lib/utils";
import { mergeAttributes, Node } from "@tiptap/core";
import {NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer} from "@tiptap/react"
import { File } from "lucide-react";
import {Plugin} from "prosemirror-state"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LinkComponent = ({node}: any)=>{
    const id = node.attrs.noteID;
    const notes = useNotesStore((state)=>state.notes);
    const noteIndex = notes.findIndex((n)=>n.id===id);
    const navToNote = useNavigateToNote();
    return <NodeViewWrapper className="linkToPage">
        
        <div data-drag-handle="" onClick={()=>{navToNote(id)}} className="link-to-page hover:bg-secondary/75 cursor-pointer select-none rounded-md p-1 py-0.5 transition-colors flex items-center gap-2 my-1">
            {noteIndex == -1 ?  <File size={18} className="opacity-75"/> : fromUnicode(notes[noteIndex].icon)}
            {noteIndex == -1 ? "Select a note" : <span className="font-semibold">{notes[noteIndex].title}</span>}
        </div>
    </NodeViewWrapper>
}

export const LinkToPage = Node.create({
    name: "linkToPage",
    priority: 101,
    group: "block",
    atom: true,
    draggable: true,
    addAttributes() {
        return {
            noteID : {
                default: null,
            }
        }
    },
    addNodeView() {
        return ReactNodeViewRenderer(LinkComponent)
    },
    renderHTML({HTMLAttributes}){
        return ["div", mergeAttributes(HTMLAttributes, {'data-type': "linkToPage"})]
    },
    parseHTML(){
        return [
            {
                tag: 'div[data-type="linkToPage"]',
            }
        ]
    },
    addProseMirrorPlugins(){
        return [
            new Plugin({
                props: {
                    handleDrop(view, event, slice, moved){
                        if(event.dataTransfer && event.dataTransfer.types.includes("note_id")){
                            const id = event.dataTransfer.getData("note_id");
                            const nodeType = view.state.schema.nodes.linkToPage;
                            view.dispatch(
                                view.state.tr.replaceSelectionWith(
                                    nodeType.create({noteID: id})
                                )
                            )
                            return true;
                        }
                        return false;
                    }
                }
            })
        ]
    }
})