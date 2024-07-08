import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PanelRightClose } from "lucide-react"
import { RefObject } from "react"
import { NoteDropdown } from "./note-dropdown"

export type TitlebarProps = React.HTMLAttributes<HTMLDivElement> & {
    refObject: RefObject<HTMLDivElement>,
    expandCallback: ()=>void,
    isSidebarCollapsed: boolean
}

export function Titlebar(props: TitlebarProps){
    return <div ref={props.refObject} className='titlebar h-12 bg-background flex-shrink-0 flex [&>div]:flex-shrink-0 p-2 justify-start gap-1'>
        <Button data-testid="button-expand-sidebar" size={"icon32"} variant={"ghost"} 
            className={cn("flex-shrink-0", !(props.isSidebarCollapsed) && "hidden")} 
            onClick={()=>{props.expandCallback()}}
            title="Show sidebar">
            <PanelRightClose width={20} height={20}></PanelRightClose>
        </Button>
        <NoteDropdown></NoteDropdown>
</div>
}