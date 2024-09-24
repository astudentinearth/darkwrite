import { Note } from "@darkwrite/common";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { useEditorState } from "@renderer/context/editor-state";
import { useLocalStore } from "@renderer/context/local-state";
import { useNotesStore } from "@renderer/context/notes-context";
import { getContents } from "@renderer/lib/api/note";
import { cn } from "@renderer/lib/utils";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { EditorCover } from "./cover";
import { ListEditor } from "./list-editor";
import { TextEditor } from "./text-editor";

export function EditorRoot(){
    const page = useEditorState((state)=>state.page);
    const setPage = useEditorState((state)=>state.setPage)
    const setID = useEditorState((state)=>state.setID);
    const notes = useNotesStore((state)=>state.notes);
    const spellcheck = useLocalStore((s)=>s.useSpellcheck);
    //const id = useEditorState((state)=>state.id);
    const getOne = useNotesStore((state)=>state.getOne)
    const [params] = useSearchParams();
    const value = useEditorState((s)=>s.content);
    const setValue = useEditorState((s)=>s.setContent);
    const setCustomizations = useEditorState((s)=>s.setCustomzations);
    const forceSave = useEditorState((state)=>state.forceSave);

    const sidebarCollapsed = useLocalStore((s)=>s.isSidebarCollapsed);

    const containerRef = useRef<HTMLDivElement>(null);

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

    useEffect(()=>{
        const saveBeforeQuit = ()=>{
            forceSave();
        }
        window.addEventListener("beforeunload", saveBeforeQuit);
        return ()=>window.removeEventListener("beforeunload", saveBeforeQuit);
    }, [])

    return <ScrollArea className="h-full w-full overflow-y-auto overflow-x-auto">
        <div className="w-full flex justify-center">
            <div spellCheck={spellcheck} ref={containerRef} className={cn("w-full", sidebarCollapsed && "max-w-[90vw]", !sidebarCollapsed && "max-w-[40vw] sm:max-w-[50vw] md:max-w-[60vw]")}>
                <EditorCover></EditorCover>
                {page.id !== "" ?
                        (
                            page.todoListID == null ? <TextEditor initialValue={value} onChange={setValue}></TextEditor> : <ListEditor></ListEditor>
                        ) :
                        <span>Page not found</span>
                }
            </div>
        </div>
    </ScrollArea>
}