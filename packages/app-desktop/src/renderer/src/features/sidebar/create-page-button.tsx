import { Button } from "@renderer/components/ui/button";
import { createNewNote } from "@renderer/context/notes-context";
import { useNavigateToNote } from "@renderer/hooks/use-navigate-to-note";
import { cn } from "@renderer/lib/utils";
import { SquarePen } from "lucide-react";

export default function CreatePageButton(){
    const nav = useNavigateToNote();
    const create = async () => {
        const note = await createNewNote();
        if(note) await nav(note.id);
    }
    //FIXME: Extract this button component
    return <Button  onClick={create} variant={"ghost"} className={cn("rounded-[8px] hover:bg-secondary/50 text-foreground/60 hover:text-foreground active:bg-secondary/25 transition-colors grid grid-cols-[24px_1fr] select-none p-1 pl-2 h-8 overflow-hidden")}>
        <SquarePen size={16}></SquarePen>
        <span className="justify-self-start">New page</span>
    </Button>
}