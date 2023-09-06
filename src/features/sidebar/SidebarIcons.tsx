import { SidebarButton } from "./SidebarButton"

export type SidebarItem = "notes" | "favorites" | "search" | "notebooks" | "tags" | "todos" | "settings" | "spacer";

// view: boostrap-icon
const ICON_MAP={
    "notes": "stickies",
    "favorites": "star",
    "search": "search",
    "notebooks": "journals",
    "tags": "tags",
    "todos": "check-all",
    "settings": "gear",
    "spacer": ""
}

const DEFAULT_ITEMS:SidebarItem[] = ["notes", "favorites", "search", "notebooks", "tags", "todos", "spacer", "settings"]

interface SidebarIconViewProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch: React.Dispatch<any>;
    view: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    state: any;
    items?: SidebarItem[];
    docked?: boolean;
}


export default function SidebarIcons(props: SidebarIconViewProps){
    const isActive = (view:string)=>{return view===props.view && props.state.paneVisible}

    return <div className={`flex flex-col bg-bg2 flex-shrink-0 w-16 items-center select-none gap-2 p-2 ${props.docked ? "rounded-none" : "rounded-2xl"}`}>
        {(props.items || DEFAULT_ITEMS).map((i)=>{
                    if(i==="spacer") return <div className="flex-grow"></div>
                    return <SidebarButton onClick={()=>{props.dispatch(i)}} icon={ICON_MAP[i]} key={i} active={isActive(i)}></SidebarButton>
        })}
    </div>
}

