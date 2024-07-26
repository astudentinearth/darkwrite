import { Button } from "@renderer/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@renderer/components/ui/dropdown-menu";
import Picker from "@emoji-mart/react";
import { emojify } from "node-emoji";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useEditorState } from "@renderer/context/editor-state";
import { useNotesStore } from "@renderer/context/notes-context";

export function EditorCover(){
    const page = useEditorState((state)=>state.page);
    const setPage = useEditorState((state)=>state.setPage)
    const [emojiOpen, setEmojiOpen] = useState(false);
    const reload = useNotesStore((state)=>state.fetch)
    const titleRef = useRef<HTMLTextAreaElement>(null);
    useEffect(()=>{adjustHeight()}, [page])
    useEffect(()=>{
        const resize = ()=>{
            adjustHeight();
        }
        window.addEventListener("resize", resize);
        return ()=>{window.removeEventListener("resize", resize)};
    })
    const adjustHeight = ()=>{
        if(!titleRef.current) return
        titleRef.current.style.height = "auto";
        titleRef.current.style.height = `${titleRef.current.scrollHeight+2}px`;
    }
    const handleTitleChange = (e: ChangeEvent<HTMLTextAreaElement>)=>{
        setPage(page.setTitle(e.target.value));
    }
    useEffect(()=>{
        if(page.id==="") return;
        const change = setTimeout(()=>{
            page.save();
        }, 200)
        return ()=>clearTimeout(change);
    }, [page, reload])
    return <div className="mt-20 max-w-[960px] flex-shrink-0 w-full flex flex-col"> {/* header */}
            <DropdownMenu open={emojiOpen} onOpenChange={(o)=>{setEmojiOpen(o)}} modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} className="text-5xl h-16 w-16">{emojify(page.icon, {fallback: "📄"})}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-0 rounded-xl">
                    <Picker onEmojiSelect={async (data: {shortcodes: string})=>{
                        setEmojiOpen(false);
                        setPage(page.setIcon(data.shortcodes));
                        await page.save();
                        await reload();
                    }} previewPosition={"none"}></Picker>
                </DropdownMenuContent>
            </DropdownMenu>
            
            <textarea onInput={handleTitleChange} ref={titleRef} rows={1} cols={1} className="text-4xl px-1 box-border bg-transparent border-none p-2 overflow-hidden h-auto flex-grow resize-none outline-none font-semibold block" value={page.title}></textarea>
        </div>
}