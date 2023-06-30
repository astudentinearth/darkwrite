export default function Icon(props: {icon: string, size?: number, color?: string}){
    return <i className={`bi-${props.icon} select-none`} 
    style={{
        "fontSize": (props.size==null ? "16px" : `${props.size}px`),
        "color": props.color == null ? "rgb(var(--text))" : props.color
    }}></i>
}