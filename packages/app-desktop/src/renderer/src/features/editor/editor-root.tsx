import { useEditorState } from "@renderer/context/editor-state";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { EditorCover } from "./cover";
import { ListEditor } from "./list-editor";
import { TextEditor } from "./text-editor";
import { Note } from "@darkwrite/common";
import { useNotesStore } from "@renderer/context/notes-context";
import { ActionMenu } from "./action-menu";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { getContents } from "@renderer/lib/api/note";

export function EditorRoot(){
    const page = useEditorState((state)=>state.page);
    const setPage = useEditorState((state)=>state.setPage)
    const setID = useEditorState((state)=>state.setID);
    const notes = useNotesStore((state)=>state.notes);
    //const id = useEditorState((state)=>state.id);
    const getOne = useNotesStore((state)=>state.getOne)
    const [params] = useSearchParams();
    const value = useEditorState((s)=>s.content);
    const setValue = useEditorState((s)=>s.setContent);
    const setCustomizations = useEditorState((s)=>s.setCustomzations);
    useEffect(()=>{
        const id = params.get("id");
        if(!id) {setPage({} as Note); setID(""); return}
        const result = getOne(id);
        if(!result) return;
        setPage(result);
        setID(id);
        const load = async ()=>{
            const data_str = await getContents(id);
            try {
                const data = JSON.parse(data_str);
                const content = data["content"] ?? {};
                const customizations = data["customizations"] ?? {};
                setValue(content);
                setCustomizations(customizations);
            } catch (error) {
                setValue({});
                setCustomizations({});
            }
        }
        load();
    },[params, setPage, setID, getOne, notes])

    return <ScrollArea className="h-full overflow-auto flex flex-col items-center px-12">
        <ActionMenu></ActionMenu>
        <EditorCover></EditorCover>
        {page.id !== "" ?
            (
                page.todoListID == null ? <TextEditor initialValue={value} onChange={setValue}></TextEditor> : <ListEditor></ListEditor>
            ) :
            <span>Page not found</span>
        }
    </ScrollArea>
}