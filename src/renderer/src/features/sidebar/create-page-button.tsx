import { Button } from "@renderer/components/ui/button";
import { Note } from "@renderer/lib/note";
import { cn } from "@renderer/lib/utils";
import { SquarePen } from "lucide-react";

export default function CreatePageButton(){
    return <Button  onClick={()=>Note.create()} variant={"ghost"} className={cn("justify-start bg-card/75 rounded-[12px] p-2 hover:bg-secondary/50 text-foreground/75 hover:text-foreground active:bg-secondary/25 transition-colors grid grid-cols-[24px_1fr] select-none pl-3 overflow-hidden")}>
        <SquarePen size={16}></SquarePen>
        <span className="justify-self-start">New page</span>
    </Button>
}