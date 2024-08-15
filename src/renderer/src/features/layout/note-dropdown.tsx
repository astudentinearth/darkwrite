
import { Button } from "@renderer/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent } from "@renderer/components/ui/dropdown-menu";
import { useNotesStore } from "@renderer/context/notes-context";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { Emoji } from "emoji-picker-react";
import { Note } from "@common/note";
import { EmojiStyle } from "emoji-picker-react";

export function NoteDropdown(){
    const [search] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    const notes = useNotesStore((state)=>state.notes);
    const [parentNodes, setParentNodes] = useState<Note[]>([]);
    const [title, setTitle] = useState<string>("Darkwrite");
    const [note, setNote] = useState<Note>({} as Note);
    useEffect(()=>{
        const id = search.get("id");
        const path = location.pathname;
        const resolveUpperTree = (note: Note)=>{
            if(note.parentID == null) setParentNodes([]);
            const nodes:Note[] = [];
            for(let id = note.parentID; id != null;){ // start from the first parent
                const parent = notes.find((n)=>n.id===id); // find the parent
                if(parent){ 
                    nodes.push(parent); // add it to nodes
                    id = parent.parentID; // attempt resolving the next parent
                }
                else break
            }
            setParentNodes(nodes);
        }
        if(id==null && path!=="/page"){
            switch(path){
                case "/": {setTitle("Home"); break}
                case "/settings": {setTitle("Settings"); break}
            }
        }
        else{
            // set title
            const note = notes.find((n)=>n.id===id);
            if(note) setNote(note);

            // get parent nodes
            if(note) resolveUpperTree(note);
        }
    }, [search, location, notes]);
    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} className="px-2 h-auto gap-1 [&>span]:leading-[18px]"><ChevronDown size={18}></ChevronDown><Emoji emojiStyle={EmojiStyle.NATIVE} size={18} unified={note.icon}></Emoji>&nbsp;{note.title}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            {parentNodes.map((n)=><DropdownMenuItem key={n.id} onClick={()=>navigate({pathname: "/page", search: `?id=${n.id}`})} className="[&>span]:leading-[18px]"><Emoji size={18} emojiStyle={EmojiStyle.NATIVE} unified={n.icon}></Emoji>&nbsp; {n.title}</DropdownMenuItem>)}
            {parentNodes.length===0 ? <span className="text-sm text-foreground/50 p-2 inline-block">No pages above</span>: <></>}
        </DropdownMenuContent>
    </DropdownMenu>
}