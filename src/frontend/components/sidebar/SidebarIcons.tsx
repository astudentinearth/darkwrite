import { SidebarButton } from "./SidebarButton"

export default function SidebarIcons(props: {dispatch: React.Dispatch<any>, view: string, state:any}){
    const isActive = (view:string)=>{return view===props.view && props.state.paneVisible}
    return <div className="flex flex-col flex-shrink-0 w-16 bg-bg1 items-center select-none gap-2 rounded-2xl p-2">
    <SidebarButton onClick={()=>{props.dispatch("notes")}} icon="stickies" active={isActive("notes")}></SidebarButton>
    <SidebarButton onClick={()=>{props.dispatch("favorites")}} icon="star" active={isActive("favorites")}></SidebarButton>
    <SidebarButton onClick={()=>{props.dispatch("search")}} icon="search" active={isActive("search")}></SidebarButton>
    <SidebarButton onClick={()=>{props.dispatch("notebooks")}} icon="journals" active={isActive("notebooks")}></SidebarButton>
    <SidebarButton onClick={()=>{props.dispatch("tags")}} icon="tags" active={isActive("tags")}></SidebarButton>
    <SidebarButton onClick={()=>{props.dispatch("todos")}} icon="check-all" active={isActive("todos")}></SidebarButton>
    <div className="flex-grow"></div>
    <SidebarButton onClick={()=>{props.dispatch("settings")}} icon="gear" active={isActive("settings")}></SidebarButton>
    </div>
}