import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PanelRightOpen, SquarePen } from "lucide-react";


export type SidebarProps = React.HTMLAttributes<HTMLDivElement> & {
    collapsed?: boolean,
    width: number,
    collapseCallback: ()=>void
}

export function Sidebar(props: SidebarProps){
    const {width,  collapseCallback} = props;
    return <div className={cn('bg-background h-full flex flex-col', props.className)} style={{width: `${width}px`}}>
        <div className='titlebar w-full h-12 bg-background flex-shrink-0 flex [&>button]:flex-shrink-0 p-2 items-center gap-1'>
            <Button size={"icon32"} variant={"ghost"} className="flex-shrink-0" title="Create note">
            <img src="icon64.png" className="flex-shrink-0 w-5 h-5"></img>
            </Button>
            <div className="flex-grow titlebar spacer"></div>
            <Button size={"icon32"} variant={"ghost"} className="flex-shrink-0" title="Create note">
                <SquarePen width={20} height={20}></SquarePen>
            </Button>
            <Button size={"icon32"} variant={"ghost"} className="flex-shrink-0" onClick={collapseCallback} title="Hide sidebar">
                <PanelRightOpen width={20} height={20}></PanelRightOpen>
            </Button>
        </div>
    </div>
}