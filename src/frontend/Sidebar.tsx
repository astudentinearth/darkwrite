import SidebarTabView from "./components/SidebarTabView";

function Sidebar(){
    return <div id="sidebar" className="div_tasks flex flex-shrink-0 flex-grow-0 w-72
    backdrop-blur-md bg-secondary/80 text-default mr-2
    z-10 sidebar-open rounded-2xl h-full min-h-0
    transition-all overflow-x-hidden overflow-y-hidden" >
        <SidebarTabView></SidebarTabView>
    </div>
}

export default Sidebar;