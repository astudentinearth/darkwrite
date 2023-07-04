import { useCallback } from "react";
import { SidebarButton } from "./SidebarButton"

export type SidebarItem = "notes" | "favorites" | "search" | "notebooks" | "tags" | "todos" | "settings" | "spacer";

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

export default function SidebarIcons(props: {dispatch: React.Dispatch<any>, view: string, state:any,items?:SidebarItem[]}){
    const isActive = (view:string)=>{return view===props.view && props.state.paneVisible}

    return <div className="flex flex-col flex-shrink-0 w-16 bg-bg1 items-center select-none gap-2 rounded-2xl p-2">
        {(props.items || DEFAULT_ITEMS).map((i)=>{
                    if(i==="spacer") return <div className="flex-grow"></div>
                    return <SidebarButton onClick={()=>{props.dispatch(i)}} icon={ICON_MAP[i]} key={i} active={isActive(i)}></SidebarButton>
        })}
    </div>
}

