import SidebarTabView from "./Components/SidebarTabView";

function Sidebar(){
    return <div id="sidebar" className="div_tasks flex flex-shrink-0 flex-grow-0 w-72 overflow-y-auto 
    backdrop-blur-md bg-secondary/80 text-default mr-2
    z-10 sidebar-open rounded-2xl h-full
    transition-all overflow-x-hidden" >
        <SidebarTabView></SidebarTabView>
    </div>
}

export default Sidebar;