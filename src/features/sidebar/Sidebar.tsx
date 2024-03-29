import { useEffect, useReducer, useRef } from "react";
import SidebarIcons from "./SidebarIcons";
import { CheckBox } from "../../frontend/components";
import {TasksView, TagsView, NotebooksView, NotesView, FavoritesView, SettingsSidebarView, SearchView} from "./views"

interface SidebarState{
    paneVisible: boolean,
    view: string
}

interface SidebarProps{
    docked?: boolean; // float by default
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

function GetView(name: string){
    switch(name){
        case "notes":
            return <NotesView/>
        case "favorites":
            return <FavoritesView/>
        case "search":
            return <SearchView/>
        case "notebooks":
            return <NotebooksView/>
        case "tags":
            return <TagsView/>
        case "todos":
            return <TasksView/>
        case "settings":
            return <SettingsSidebarView/>
    }
}

export function Sidebar(props: SidebarProps){
    const [state, dispatch] = useReducer(reducer, {paneVisible: false, view: "notes"})
    const sidebarRef = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        sidebarRef.current?.style.setProperty("width",state.paneVisible ? "320px" : "64px")
    },[state.paneVisible])
    return  <div ref={sidebarRef} className={`flex bg-bg1 duration-100 overflow-x-clip transition-all flex-row ${props.docked ? "rounded-none" : "rounded-2xl"}`}>
            <SidebarIcons {...props} dispatch={dispatch} view={state.view} state={state}></SidebarIcons>
            <div className="flex-grow overflow-x-hidden text-text-default overflow-y-auto">
                {GetView(state.view)}
            </div>
        </div>
}