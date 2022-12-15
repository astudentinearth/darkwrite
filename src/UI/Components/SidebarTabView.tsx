import { useState } from "react";
import { Tasks } from "../Tasks";

function SidebarTabView(props:any){
    /**
     * TabView for sidebar
     */
    const [view,setView] = useState(0);

    return <div className="flex flex-col">
        <div className="tabview-header flex-[0_0_56px] h-14 flex">
            <div className="w-[144px] flex items-center justify-center select-none cursor-pointer" 
            style={view == 0 ? {borderBottom:"2px solid rgb(var(--accent))"} : {borderBottom:"2px solid transparent"}}
            onClick={()=>{setView(0)}}>
                <span className="text-xl"><i className="bi-check2-circle"></i> Tasks</span>
            </div>
            <div className="w-[144px] flex items-center justify-center select-none cursor-pointer"
            style={view == 1 ? {borderBottom:"2px solid rgb(var(--accent))"} : {borderBottom:"2px solid transparent"}}
            onClick={()=>{setView(1)}}>
                <span className="text-xl"><i className="bi-clipboard"></i> Boards</span>
            </div>
        </div>
        {view == 0 ? <Tasks></Tasks> : <div>boards</div>}
    </div>
}

export default SidebarTabView;
