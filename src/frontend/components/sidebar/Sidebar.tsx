import { useEffect, useReducer, useRef } from "react";
import SidebarIcons from "./SidebarIcons";
import { Button } from "../ui/Button";

interface SidebarState{
    paneVisible: boolean,
    view: string
}

/**
     * 
     * @param state 
     * @param action New view name
     * @returns 
     */
function reducer(state:SidebarState, action:string){
    const newstate = {...state};
    if(action === state.view) newstate.paneVisible=!state.paneVisible;
    else newstate.paneVisible=true
    newstate.view=action;
    return newstate;
}


export function Sidebar(){
    const [state, dispatch] = useReducer(reducer, {paneVisible: false, view: "notes"})
    
    const sidebarRef = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        sidebarRef.current?.style.setProperty("width",state.paneVisible ? "320px" : "64px")
    },[state.paneVisible])
    return  <div ref={sidebarRef} className="flex duration-100 overflow-x-clip transition-all flex-row bg-bg2 gap-2 rounded-2xl">
            <SidebarIcons dispatch={dispatch} view={state.view} state={state}></SidebarIcons>
            <div className="flex flex-col gap-2">
                
            </div>
        </div>

}