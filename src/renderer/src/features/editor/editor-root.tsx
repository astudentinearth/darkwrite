import { useEditorState } from "@renderer/context/editor-state";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { EditorCover } from "./cover";
import { ListEditor } from "./list-editor";
import { TextEditor } from "./text-editor";
import { Note } from "@common/note";
import { useNotesStore } from "@renderer/context/notes-context";
import { ActionMenu } from "./action-menu";

export function EditorRoot(){
    const page = useEditorState((state)=>state.page);
    const setPage = useEditorState((state)=>state.setPage)
    const setID = useEditorState((state)=>state.setID);
    const notes = useNotesStore((state)=>state.notes);
    const id = useEditorState((state)=>state.id);
    const getOne = useNotesStore((state)=>state.getOne)
    const [params] = useSearchParams();
    useEffect(()=>{
        const id = params.get("id");
        if(!id) {setPage({} as Note); setID(""); return}
        const result = getOne(id);
        if(!result) return;
        setPage(result);
        setID(id);
    },[params, setPage, setID, getOne, notes])

    return <div className="h-full overflow-auto flex flex-col items-center px-12">
        <ActionMenu></ActionMenu>
        <EditorCover></EditorCover>
        {page.id !== "" ?
            (
                page.todoListID == null ? <TextEditor></TextEditor> : <ListEditor></ListEditor>
            ) :
            <span>Page not found</span>
        }
    </div>
}