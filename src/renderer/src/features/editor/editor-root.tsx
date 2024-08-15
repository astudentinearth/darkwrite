import { useEditorState } from "@renderer/context/editor-state";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { EditorCover } from "./cover";
import { ListEditor } from "./list-editor";
import { TextEditor } from "./text-editor";
import { Note } from "@common/note";

export function EditorRoot(){
    const page = useEditorState((state)=>state.page);
    const setPage = useEditorState((state)=>state.setPage)
    const [params] = useSearchParams();
    useEffect(()=>{
        (async ()=>{
            const id = params.get("id");
            if(!id) {setPage({} as Note); return}
            const result = await window.api.note.getNote(id);
            if(!result) return;
            setPage(result);
        })();
    },[params, setPage])
    
    useEffect(()=>{
        console.log("Page changed", page);
    }, [page])

    return <div className="h-full overflow-auto flex flex-col items-center px-12">
        <EditorCover></EditorCover>
        {page.id !== "" ?
            (
                page.todoListID == null ? <TextEditor note={page}></TextEditor> : <ListEditor note={page}></ListEditor>
            ) :
            <span>Page not found</span>
        }
    </div>
}