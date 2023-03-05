import { useState } from "react";
import { Tasks } from "../Tasks";
import { Notebooks } from "./Notebooks";

function SidebarTabView(props:any){
    /**
     * TabView for sidebar
     */
    const [view,setView] = useState(0);
    const activeStyle:React.CSSProperties = {background:"rgb(var(--accent) /0.5)",borderRadius:"99px"};
    const inactiveStyle:React.CSSProperties = {};
    return <div className="flex flex-col">
        <div className="tabview-header flex-[0_0_56px] h-14 flex">
            <div className="w-[144px] flex items-center justify-center select-none cursor-pointer" 
            
            onClick={()=>{setView(0)}}>
                <span style={view == 0 ? activeStyle : {}} className="text-lg py-1 px-2 w-32 text-center"><i className="bi-check2-circle"></i> Tasks</span>
            </div>
            <div className="w-[144px] flex items-center justify-center select-none cursor-pointer"
            onClick={()=>{setView(1)}}>
                <span style={view == 1 ? activeStyle : {}} className="text-lg py-1 px-2 w-32 text-center"><i className="bi-journals"></i> Notebooks</span>
            </div>
        </div>
        {view == 0 ? <Tasks></Tasks> : <Notebooks></Notebooks>}
    </div>
}

export default SidebarTabView;
