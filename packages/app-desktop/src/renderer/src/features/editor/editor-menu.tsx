import { Button } from "@renderer/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@renderer/components/ui/dropdown-menu";
import { Switch } from "@renderer/components/ui/switch";
import { useLocalStore } from "@renderer/context/local-state";
import { Brush, Copy, Download, Menu, Upload } from "lucide-react";
import { useState } from "react";
import { CustimzationSheet } from "./customizations/customization-sheet";
import { useEditorState } from "@renderer/context/editor-state";
import { exportHTML, importHTML } from "@renderer/lib/api/note";
import { duplicateNote } from "@renderer/context/notes-context";

export function EditorMenu(){
    const [customizationsOpen, setCustomizationsOpen] = useState(false);
    const editor = useEditorState(state=>state.editorInstance);
    const activeNote = useEditorState((s)=>s.id);
    const checker = useLocalStore((s)=>s.useSpellcheck);
    const setCheck = useLocalStore((s)=>s.setSpellcheck);
    return <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
            <Button className={"opacity-60 hover:opacity-100 transition-[background,opacity]"} size={"icon32"} variant={"ghost"}>
                <Menu size={20}/>
            </Button>
        </DropdownMenuTrigger>
        <CustimzationSheet open={customizationsOpen} onOpenChange={setCustomizationsOpen}/>
        { /* TODO: Unify dropdown menu item style */}
        <DropdownMenuContent className="mr-3 mt-1 rounded-xl bg-card">
            <DropdownMenuItem onSelect={(e)=>{
                e.preventDefault();
                setCheck(!checker);
            }} className="gap-2 rounded-lg">
                <Switch checked={checker} className="cursor-default data-[state=unchecked]:bg-view-2 outline-border outline-1 outline outline-offset-0"/>
                Check spelling
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem className="gap-2 rounded-lg" onSelect={(e)=>{e.preventDefault();setCustomizationsOpen(true)}}><Brush size={18}/>Customize</DropdownMenuItem>
            <DropdownMenuItem onSelect={()=>{exportHTML(activeNote)}} className="gap-2 rounded-lg"><Download size={18}/>Export</DropdownMenuItem>
            <DropdownMenuItem onSelect={async ()=>{
                const html = await importHTML();
                editor?.commands.insertContent(html);
            }} className="gap-2 rounded-lg"><Upload size={18}/>Import</DropdownMenuItem>
            <DropdownMenuItem onClick={()=>{duplicateNote(activeNote)}} className="gap-2 rounded-lg"><Copy size={18}/>Duplicate</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
}