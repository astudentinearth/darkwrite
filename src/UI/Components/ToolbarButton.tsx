/**
     * Returns a toolbar button component
     * Props:
     * style: css style
     * onClick: click action
     * icon: icon to be shown
     * class: extra class names
     * color: [normal | accent] specify color style
     **/
function ToolbarButton(props:any){
    
    return <div className={(props.color=="accent" ? " toolbar-button-accent " : " toolbar-button ")+(props.class || " ")} 
    style={props.style}
    onClick={props.onClick}>
        <i className={"w-[30px] h-[30px] text-center flex items-center text-3xl "+props.icon}></i>
    </div>;
}
export default ToolbarButton;