import { useEffect, useReducer, useRef, useState } from "react";
import SidebarIcons from "./SidebarIcons";

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
    return  <div ref={sidebarRef} className="flex duration-100 transition-all flex-row bg-bg2 gap-2 rounded-2xl">
            <SidebarIcons dispatch={dispatch} view={state.view} state={state}></SidebarIcons>
        </div>

}