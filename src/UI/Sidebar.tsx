import SidebarTabView from "./Components/SidebarTabView";

function Sidebar(){
    return <div id="sidebar" className="div_tasks fixed w-72 overflow-y-auto 
    backdrop-blur-md bg-secondary/20 text-default
    bottom-2 top-16 z-10 open left-[-18rem] rounded-2xl
    transition-all" >
        <SidebarTabView></SidebarTabView>
    </div>
}

export default Sidebar;