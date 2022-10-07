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
    
    return <div className={(props.class || "")+(props.color=="accent" ? " toolbar-button-accent" : "toolbar-button")} 
    style={props.style}
    onClick={props.onClick}>
        <i className={"text-3xl "+props.icon}></i>
    </div>;
}
export default ToolbarButton;