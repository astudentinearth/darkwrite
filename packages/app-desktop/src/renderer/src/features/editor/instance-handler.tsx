import { useEditorState } from "@renderer/context/editor-state";
import { useEditor } from "novel"
import { useEffect } from "react";

export default function InstanceHandler(){
    const {editor} = useEditor();
    const setEditor = useEditorState((s)=>s.setEditorInstance);
    useEffect(()=>{
        setEditor(editor);
    }, [editor])
    return <></>
}