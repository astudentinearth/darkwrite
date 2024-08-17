import { Button } from "@renderer/components/ui/button"
import {Popover, PopoverTrigger, PopoverContent} from "@renderer/components/ui/popover"
import { useNotesStore } from "@renderer/context/notes-context"
import { useNavigateToNote } from "@renderer/hooks/use-navigate-to-note"
import { cn } from "@renderer/lib/utils"
import { Emoji, EmojiStyle } from "emoji-picker-react"
import { Trash, Undo } from "lucide-react"
export function TrashWidget(){
    const notes = useNotesStore((store)=>store.notes);
    const restore = useNotesStore((store)=>store.restoreFromTrash);
    const del = useNotesStore((store)=>store.delete);
    const trashed = notes.filter((n)=>n.isTrashed);
    const nav = useNavigateToNote();
    return <Popover>
        <PopoverTrigger asChild>
            <Button variant={"ghost"} className={cn("justify-start flex-shrink-0 bg-card/75 rounded-[12px] p-2 hover:bg-secondary/50 text-foreground/75 hover:text-foreground active:bg-secondary/25 transition-colors grid grid-cols-[24px_1fr] select-none pl-3 overflow-hidden")}>
                <Trash size={16}/>
                <span className="justify-self-start">Trash</span>
            </Button>
        </PopoverTrigger>
        <PopoverContent side={"right"} className="p-2" sticky="always">
            <h1>Trash</h1>
            <div>
            {trashed.map((note)=><div key={note.id}>
                <div onClick={()=>{nav(note.id)}} 
                className={cn("rounded-[8px] note-item hover:bg-secondary/50 hover:text-foreground font-medium active:bg-secondary/25 transition-colors grid grid-cols-[24px_1fr_24px_24px] select-none p-1 h-8 overflow-hidden")}>
                    <div className="flex w-6 h-6 items-center justify-center [&>span]:block [&>span]:leading-[18px] translate-x-[-15%]"><Emoji size={18} emojiStyle={EmojiStyle.NATIVE} unified={note.icon}></Emoji></div>
                    <span className={cn("text-ellipsis whitespace-nowrap block overflow-hidden text-sm self-center pl-1")}>{note.title}</span>
                    <Button title="Restore" size="icon24" className="justify-self-end btn-add text-foreground/75 hover:text-foreground/100" variant={"ghost"} onClick={(e)=>{
                        e.stopPropagation();
                        restore(note.id);
                    }}>
                        <Undo size={18}/>
                    </Button>
                    <Button title="Delete permanently" size="icon24" className="justify-self-end btn-add text-destructive/75 hover:text-destructive/100" variant={"ghost"} onClick={(e)=>{
                        e.stopPropagation();
                        del(note.id);
                    }}>
                        <Trash size={18}/>
                    </Button>
                    </div>
                </div>)}
            </div>
        </PopoverContent>
    </Popover>
}