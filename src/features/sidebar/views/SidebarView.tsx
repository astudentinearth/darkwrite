import "./SidebarView.css"

export function SidebarView(props: any){
    return <div className="sidebarview p-2 overflow-x-clip">
        <div>
            {props.children}
        </div>
    </div>
}