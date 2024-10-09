import { Button } from "@renderer/components/ui/button";
import { createNewNote } from "@renderer/context/notes-context";
import { cn } from "@renderer/lib/utils";
import { SquarePen } from "lucide-react";

export default function CreatePageButton(){
    //FIXME: Extract this button component
    return <Button  onClick={()=>{createNewNote()}} variant={"ghost"} className={cn("rounded-[8px] hover:bg-secondary/50 text-foreground/60 hover:text-foreground active:bg-secondary/25 transition-colors grid grid-cols-[24px_1fr] select-none p-1 pl-2 h-8 overflow-hidden")}>
        <SquarePen size={16}></SquarePen>
        <span className="justify-self-start">New page</span>
    </Button>
}