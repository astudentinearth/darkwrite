import { useState } from "react";
import { Tasks } from "../Tasks";

function SidebarTabView(props:any){
    /**
     * TabView for sidebar
     */
    const [view,setView] = useState(0);

    return <div>
        <div className="tabview-header h-14 flex">
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
        <div>
            {view == 0 ? <Tasks></Tasks> : <div>boards</div>}
        </div>
    </div>
}

export default SidebarTabView;