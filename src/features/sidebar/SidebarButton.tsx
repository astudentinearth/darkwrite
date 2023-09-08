import { CSSProperties } from "react"
import {Icon} from "../../frontend/components"

const ACTIVE_STYLE:CSSProperties = {
    "background": "rgb(var(--primary))"
}

export function SidebarButton(props:SidebarButtonProps){
    return <div style={props.active ? ACTIVE_STYLE : {}} 
    className={`w-12 h-12 flex justify-center items-center rounded-lg select-none
    ${props.active ? "hover:brightness-125 active:brightness-150" : "hover:bg-widget-hover active:bg-widget-active" }
    transition-all duration-100`} onClick={props.onClick}>
        <Icon icon={props.icon} size={24}></Icon>
    </div>
}

export interface SidebarButtonProps{
    icon: string,
    onClick: ()=>void,
    active?: boolean
}