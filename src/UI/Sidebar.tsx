import SidebarTabView from "./Components/SidebarTabView";

function Sidebar(){
    return <div id="sidebar" className="div_tasks flex fixed w-72 overflow-y-auto 
    backdrop-blur-md bg-secondary/80 text-default
    bottom-2 top-16 z-10 open left-[-18rem] rounded-2xl
    transition-all overflow-x-hidden" >
        <SidebarTabView></SidebarTabView>
    </div>
}

export default Sidebar;